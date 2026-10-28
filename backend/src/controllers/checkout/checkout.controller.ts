import type { Request, Response } from "express";
import { auth } from "../../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { db } from "../../db/index.js";
import { cartItems, carts, orders, payments } from "../../db/schema/app.js";
import { eq } from "drizzle-orm";

// GET /api/checkout/state - Get the current checkout state for the user
export async function getCheckoutState(req: Request, res: Response) {
  try {
    // Resolve the currently signed-in user
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    const userId = session.user.id;
    const orderIdFromQuery = req.query.orderId as string | undefined;

    // --------------------------------------------------
    // CASE 1: Current checkout has an orderId
    // --------------------------------------------------
    // Only check this specific order.
    if (orderIdFromQuery) {
      const orderId = Number(orderIdFromQuery);

      if (!Number.isInteger(orderId)) {
        return res.status(400).json({
          error: "Invalid orderId",
        });
      }

      // Make sure the order belongs to the logged-in user
      const getOrder = await db
        .select()
        .from(orders)
        .where(eq(orders.id, orderId))
        .limit(1);

      if (!getOrder.length || !getOrder[0]) {
        return res.status(404).json({
          data: {
            state: "invalid",
            message: "Order not found.",
          },
        });
      }

      const order = getOrder[0];

      if (order.userId !== userId) {
        return res.status(403).json({
          error: "You are not authorized to access this order.",
        });
      }

      // Get the payment associated with this order
      const getAssociatedPayment = await db
        .select()
        .from(payments)
        .where(eq(payments.orderId, order.id))
        .limit(1);

      if (!getAssociatedPayment.length || !getAssociatedPayment[0]) {
        return res.status(200).json({
          data: {
            state: "invalid",
            message: "Payment record not found.",
            orderId: order.id,
          },
        });
      }

      const payment = getAssociatedPayment[0];

       // COD: order is placed, cash is collected on delivery -> nothing left to pay online
     if (payment.provider === "cash-on-delivery" && payment.status === "pending") {
        return res.status(200).json({
          data: {
            state: "confirmation",
            message: "Order is placed with Cash on Delivery.",
            orderId: order.id,
          },
        });
     }

      // Fulfilled + Paid → Confirmation
      if (order.status === "fulfilled" && payment.status === "paid") {
        return res.status(200).json({
          data: {
            state: "confirmation",
            message: "Order is confirmed.",
            orderId: order.id,
          },
        });
      }

      // Pending + Pending → Payment
      if (order.status === "pending" && payment.status === "pending") {
        return res.status(200).json({
          data: {
            state: "payment",
            message: "Payment is pending.",
            addressId: order.addressId,
            orderId: order.id,
            paymentId: payment.id,
          },
        });
      }

      // Fulfilled + Pending → Invalid state
      if (order.status === "fulfilled" && payment.status === "pending") {
        return res.status(200).json({
          data: {
            state: "invalid",
            message: "The order is fulfilled, but the payment is still pending.",
            orderId: order.id,
          },
        });
      }

      // Pending + Paid → Invalid state
      if (order.status === "pending" && payment.status === "paid") {
        return res.status(200).json({
          data: {
            state: "invalid",
            message: "The order is pending, but the payment is already paid.",
            orderId: order.id,
            paymentId: payment.id,
          },
        });
      }

      return res.status(200).json({
        data: {
          state: "invalid",
          message: "Unknown order/payment state.",
          orderId: order.id,
        },
      });
    }

    // --------------------------------------------------
    // CASE 2: No orderId
    // --------------------------------------------------
    // This means the user has not started/resumed a specific
    // checkout order, so check the cart.

    const getCart = await db
      .select()
      .from(carts)
      .where(eq(carts.userId, userId))
      .limit(1);

    if (!getCart.length || !getCart[0]) {
      return res.status(200).json({
        data: {
          state: "empty",
          message: "Cart is empty.",
        },
      });
    }

    const getCartItems = await db
      .select()
      .from(cartItems)
      .where(eq(cartItems.cartId, getCart[0].id));

    if (!getCartItems.length) {
      return res.status(200).json({
        data: {
          state: "empty",
          message: "Cart is empty.",
        },
      });
    }

    // Cart has items → Start checkout from Address
    return res.status(200).json({
      data: {
        state: "address",
        message: "Items are present in the cart.",
        cartId: getCart[0].id,
        items: getCartItems,
      },
    });
  } catch (error) {
    console.error("Error fetching checkout state:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
}