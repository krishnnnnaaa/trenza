import type { Request, Response } from "express";
import {
  cartItems,
  carts,
  orderItems,
  orders,
  payments,
} from "../../db/schema/app.js";
import { and, eq } from "drizzle-orm";
import crypto from "crypto";
import { db } from "../../db/index.js";
import { auth } from "../../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { razorpay } from "../../lib/razorpay.js";

// Verify Razorpay signature
async function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
): Promise<boolean> {
  const secret = process.env.RAZORPAY_KEY_SECRET;

  if (!secret) {
    throw new Error("RAZORPAY_KEY_SECRET is not configured");
  }

  if (!/^[a-fA-F0-9]{64}$/.test(signature)) {
    return false;
  }

  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const generatedBuffer = Buffer.from(generatedSignature, "hex");
  const signatureBuffer = Buffer.from(signature, "hex");

  return crypto.timingSafeEqual(generatedBuffer, signatureBuffer);
}

// POST /api/payment/verify - Verify Razorpay payment
export async function verifyPayment(req: Request, res: Response) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session || !session.user) {
      return res
        .status(401)
        .json({ error: "Unauthorized. Please sign in first." });
    }

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing required payment fields" });
    }

    // Fetch the payment record from the database using the Razorpay order ID
    const [paymentRecord] = await db
      .select()
      .from(payments)
      .where(eq(payments.providerOrderId, razorpay_order_id))
      .limit(1);

    // If no payment record is found, return a 404 error
    if (!paymentRecord) {
      return res.status(404).json({ error: "Payment record not found" });
    }

    const [ownedOrder] = await db
      .select()
      .from(orders)
      .where(
        and(
          eq(orders.id, paymentRecord.orderId),
          eq(orders.userId, session.user.id),
        ),
      )
      .limit(1);

    if (!ownedOrder) {
      return res
        .status(403)
        .json({ error: "You are not authorized to verify this payment." });
    }

    // Here we need to verify the signature using Razorpay's utility function.
    const isValidSignature = await verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    );

    // If the signature is invalid, return an error response
    if (!isValidSignature) {
      return res.status(400).json({ error: "Invalid Payment Signature." });
    }

    const razorpayPayment = await razorpay.payments.fetch(razorpay_payment_id);

    if (
      razorpayPayment.id !== razorpay_payment_id ||
      razorpayPayment.order_id !== razorpay_order_id ||
      razorpayPayment.status !== "captured" ||
      razorpayPayment.amount !==
        Math.round(Number(paymentRecord.amount) * 100) ||
      razorpayPayment.currency !== "INR"
    ) {
      return res
        .status(400)
        .json({ error: "Payment details could not be verified." });
    }

    const paymentResponse = await db.transaction(async (tx) => {
      // Update the payment record in the database to mark it as successful
      const [payment] = await tx
        .update(payments)
        .set({
          status: "paid",
          providerPaymentId: razorpay_payment_id,
        })
        .where(
          and(
            eq(payments.providerOrderId, razorpay_order_id),
            eq(payments.status, "pending"),
          ),
        )
        .returning();

     if (!payment) {
  const [existingPayment] = await tx
    .select()
    .from(payments)
    .where(eq(payments.providerOrderId, razorpay_order_id))
    .limit(1);

  // Already processed: same payment ID
  if (
    existingPayment?.status === "paid" &&
    existingPayment.providerPaymentId === razorpay_payment_id
  ) {
    return {
      alreadyProcessed: true,
      data: {
        orderId: ownedOrder.id,
        razorpayOrderId: razorpay_order_id,
        orderDate: ownedOrder.createdAt.toISOString(),
        paidAt: existingPayment.updatedAt.toISOString(),
        paymentStatus: existingPayment.status,
        totalAmount: existingPayment.amount,
        razorpayPaymentId: existingPayment.providerPaymentId,
      },
    };
  }

  // Paid with a different payment ID, or unexpected status
  return {
    alreadyProcessed: false,
    data: null,
  };
}
      // Update the corresponding order status to "fulfilled"
      await tx
        .update(orders)
        .set({
          status: "fulfilled",
        })
        .where(eq(orders.id, paymentRecord.orderId));

      // fetch the order associated with the order
      const [order] = await tx
        .select()
        .from(orders)
        .where(eq(orders.id, paymentRecord.orderId))
        .limit(1);

      if (!order || !order.userId) {
        throw new Error("Order not found or userId missing for the order");
      }

      // fetch the order items associated with the order
      const orderedItems = await tx
        .select({
          productId: orderItems.productId,
          purchasedQuantity: orderItems.quantity,
        })
        .from(orderItems)
        .where(eq(orderItems.orderId, order.id));

      if (!orderedItems || orderedItems.length === 0) {
        throw new Error("No order items found for the order");
      }

      // fetch the cart associated with the order
      const [cart] = await tx
        .select()
        .from(carts)
        .where(eq(carts.userId, order.userId))
        .limit(1);

      if (!cart || !cart.id) {
        throw new Error(
          "Cart not found for the user associated with the order",
        );
      }

      for (const orderedItem of orderedItems) {
        // Update the stock quantity for each ordered item
        const [cartItem] = await tx
          .select()
          .from(cartItems)
          .where(
            and(
              eq(cartItems.cartId, cart.id),
              eq(cartItems.productId, orderedItem.productId),
            ),
          )
          .limit(1);

        if (!cartItem) continue; // If the cart item is not found, skip to the next ordered item

        const newStockQuantity =
          cartItem.quantity - orderedItem.purchasedQuantity;

        if (newStockQuantity <= 0) {
          // If the new stock quantity is zero or negative, delete the cart item
          await tx
            .delete(cartItems)
            .where(
                eq(cartItems.id, cartItem.id),
            );
          continue; // Skip to the next ordered item after deletion
        } else {
          // If the new stock quantity is positive, update the cart item with the new quantity
          await tx
            .update(cartItems)
            .set({ quantity: newStockQuantity })
            .where(
              eq(cartItems.id, cartItem.id),
            );
        }
      }

      const response = {
        orderId: order.id,
        razorpayOrderId: razorpay_order_id,
        orderDate: order.createdAt.toISOString(),
        paidAt: payment!.updatedAt.toISOString(),
        paymentStatus: payment!.status,
        totalAmount: paymentRecord.amount,
        razorpayPaymentId: razorpay_payment_id,
      };

      return {alreadyProcessed: false, data: response};
    });

   if (!paymentResponse.data) {
  return res.status(409).json({
    error: "Payment is already processed or is in an unexpected state.",
  });
}

return res.status(200).json({
  status: 200,
  message: paymentResponse.alreadyProcessed 
    ? "Payment was already verified successfully."
    : "Payment verified and order fulfilled successfully.",
  data: paymentResponse.data,
});

  } catch (error) {
    console.error("POST /payment/verify error:", error);
    return res.status(500).json({ error: "Failed to verify payment" });
  }
}
