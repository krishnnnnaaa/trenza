import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../../lib/auth.js";
import type { Request, Response } from "express";
import { db } from "../../db/index.js";
import {
  addresses,
  cartItems,
  carts,
  orderItems,
  orders,
  payments,
  productImages,
  products,
} from "../../db/schema/app.js";
import { and, desc, eq, inArray, or, sql } from "drizzle-orm";
import { createRazorpayOrder, fetchRazorpayOrder } from "../../service/razorpay.service.js";

// GET /api/orders - Get all orders for the current user
export const getOrders = async (req: Request, res: Response) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const userId = session.user.id;

    const rawPage = Number(req.query.page ?? 1);
const rawLimit = Number(req.query.limit ?? 10);

const currentPage =
  Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;

const limitPerPage =
  Number.isInteger(rawLimit) && rawLimit > 0
    ? Math.min(rawLimit, 50)
    : 10;

const offset = (currentPage - 1) * limitPerPage;
   const countResult = await db
  .select({ count: sql<number>`count(*)` })
  .from(orders)
  .innerJoin(payments, eq(payments.orderId, orders.id))
  .where(
    and(
      eq(orders.userId, userId),
      or(
        and(
          eq(payments.provider, "cash-on-delivery"),
          eq(payments.status, "pending")
        ),
        and(
          eq(payments.provider, "razorpay"),
          eq(payments.status, "paid")
        )
      )
    )
  );

        const totalCount = countResult[0]?.count ?? 0;


    const userOrders = await db
      .select({
        id: orders.id,
        userId: orders.userId,
        addressId: orders.addressId,
        status: orders.status,
        totalAmount: orders.totalAmount,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
      })
      .from(orders)
      .innerJoin(payments, eq(payments.orderId, orders.id))
      .where(and(
        eq(orders.userId, userId),
        or(
          // 
          and(
            eq(payments.provider, "cash-on-delivery"),
            eq(payments.status, "pending")
          ),
          and(
            eq(payments.provider, "razorpay"),
            eq(payments.status, "paid")
          )
        )
      ))
      .offset(offset)
      .limit(limitPerPage)
      .orderBy(desc(orders.createdAt));

    if (!userOrders.length) {
  return res.status(200).json({
    data: [],
    pagination: {
      page: currentPage,
      limit: limitPerPage,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limitPerPage),
    },
  });
}



    const orderIds = userOrders.map((order) => order.id);

    const orderItemsData = await db
      .select({
        id: orderItems.id,
        orderId: orderItems.orderId,
        productId: orderItems.productId,
        quantity: orderItems.quantity,
        price: orderItems.price,
        productName: products.name,
      })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(inArray(orderItems.orderId, orderIds));

    const productsId = orderItemsData.map((item) => item.productId);

    const productsImages = await db
      .select()
      .from(productImages)
      .where(inArray(productImages.productId, productsId));

    const orderItemsWithImages = orderItemsData.map((item) => {
      const images = productsImages.filter(
        (image) => image.productId === item.productId,
      );

      const primaryImage = images.find((image) => image.isPrimary) ?? images[0];
      return {
        ...item,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        orderId: item.orderId,
        productImage: primaryImage?.url,
      };
    });

    const ordersWithItems = userOrders.map((order) => {
      const items = orderItemsWithImages.filter(
        (item) => item.orderId === order.id,
      );

      return {
        ...order,
        items,
      };
    });

    return res.status(200).json({ 
      data: ordersWithItems, 
      pagination: {
        page: currentPage,
        limit: limitPerPage,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitPerPage),
      }
    });
  } catch (error) {
    console.error("GET /orders error:", error);
    return res.status(500).json({ error: "Failed to get orders" });
  }
};

// GET /api/orders/:orderId - Get a specific order for the current user
export const getOrderDetail = async (req: Request, res: Response) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const orderId = Number(req.params.orderId);

    if (!Number.isInteger(orderId) || orderId <= 0) {
      return res.status(400).json({ error: "Invalid orderId" });
    }

    const [order] = await db
      .select()
      .from(orders)
      .where(
        and(
          eq(orders.id, orderId),
          eq(orders.userId, session.user.id),
        ),
      )
      .limit(1);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const orderItemsData = await db
      .select({
        id: orderItems.id,
        orderId: orderItems.orderId,
        productId: orderItems.productId,
        quantity: orderItems.quantity,
        price: orderItems.price,
        productName: products.name,
        productSlug: products.slug,
      })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, orderId));

    const productIds = orderItemsData.map((item) => item.productId);
    const productsImages =
      productIds.length > 0
        ? await db
            .select()
            .from(productImages)
            .where(inArray(productImages.productId, productIds))
        : [];

    const items = orderItemsData.map((item) => {
      const images = productsImages.filter(
        (image) => image.productId === item.productId,
      );
      const primaryImage = images.find((image) => image.isPrimary) ?? images[0];

      return {
        ...item,
        productImage: primaryImage?.url,
      };
    });

    const [address] = await db
      .select()
      .from(addresses)
      .where(eq(addresses.id, order.addressId))
      .limit(1);

    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }

    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.orderId, order.id))
      .limit(1);

    return res.status(200).json({
      data: {
        ...order,
        items,
        address,
        payment: payment ?? null,
      },
    });
  } catch (error) {
    console.error("GET /orders/:orderId error:", error);
    return res.status(500).json({ error: "Failed to get order details" });
  }
};

// POST /api/orders - Create an order for the current user
export const createOrder = async (req: Request, res: Response) => {
  try {
    // Orders are tied to the currently signed-in user, so resolve the session
    // before reading any address or cart data.
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { addressId, paymentMethod } = req.body;

    // Keep the validation here before hitting the database. Converting the
    // address ID once also prevents different representations from leaking
    // into the queries below.
    if (
      !Number.isInteger(Number(addressId)) ||
      Number(addressId) <= 0 ||
      !['online', 'cash-on-delivery'].includes(paymentMethod)
    ) {
      return res.status(400).json({
        error: "Valid address ID and payment method are required",
      });
    }
    const parsedAddressId = Number(addressId);

    const userId = session.user.id;

    // Fetch the address with the user ID in the same query so one user cannot
    // place an order using another user's saved address.
    const [address] = await db
      .select()
      .from(addresses)
      .where(
        and(eq(addresses.userId, userId), eq(addresses.id, parsedAddressId)),
      )
      .limit(1);

    if (!address) {
      return res
        .status(400)
        .json({ error: "Address should belong to the user and must exist" });
    }

    // A cart is created separately from its items, so handle a missing cart
    // explicitly instead of treating it as an empty order.
    const [cart] = await db
      .select()
      .from(carts)
      .where(eq(carts.userId, session.user.id))
      .limit(1);

    if (!cart) {
      return res.status(400).json({ error: "No cart found for the user" });
    }

    // Read the product price and current stock along with each cart item. The
    // price is captured now and reused when the order items are created.
    const items = await db
      .select({
        productId: cartItems.productId,
        quantity: cartItems.quantity,
        price: products.price,
        stock: products.stock,
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.cartId, cart.id));

    if (items.length === 0) {
      return res.status(400).json({ error: "No items found in the cart" });
    }

    // Check stock before creating anything with the payment provider. This
    // avoids starting a payment flow for an order that cannot be fulfilled.
    if (items.some((item) => item.stock! < item.quantity)) {
      return res
        .status(400)
        .json({ error: "Some items in the cart exceed available stock" });
    }

    const [pendingOrder] = await db.select({
      orderId: orders.id,
      totalAmount: orders.totalAmount,
      addressId: orders.addressId,
      razorpayOrderId: payments.providerOrderId,
    }).from(orders).innerJoin(payments, eq(payments.orderId, orders.id)).where(
      and(
        eq(orders.userId, userId),
        eq(orders.status, "pending"),
        eq(payments.status, "pending"),
        eq(payments.provider, "razorpay")
      )
    )
    .orderBy(desc(orders.createdAt))
    .limit(1);


    let shouldReuseOrder = false;

if(paymentMethod === "online" && pendingOrder) {
  if (pendingOrder) {
  const existingItems = await db
    .select({
      productId: orderItems.productId,
      quantity: orderItems.quantity,
      price: orderItems.price,
    })
    .from(orderItems)
    .where(eq(orderItems.orderId, pendingOrder.orderId));

  const sameAddress =
    pendingOrder.addressId === parsedAddressId;

  const sameItems =
    existingItems.length === items.length &&
    existingItems.every((existingItem) => {
      const currentItem = items.find(
        (item) => item.productId === existingItem.productId
      );

      return (
        currentItem !== undefined &&
        currentItem.quantity === existingItem.quantity &&
        Number(currentItem.price) === Number(existingItem.price)
      );
    });

  const subtotal = items.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0
  );

  const shipping = subtotal > 49 ? 0 : 19;
  const currentTotal = subtotal + shipping;

  const sameTotal =
  Number(pendingOrder.totalAmount) === currentTotal;

  shouldReuseOrder =
    sameAddress && sameItems && sameTotal;
}

// If a pending order exists and it can be reused, verify that the Razorpay order
// is still valid. If it is, return the existing order details instead of creating
// a new order.
if (pendingOrder && shouldReuseOrder && pendingOrder.razorpayOrderId) {
  const razorpayOrder = await fetchRazorpayOrder(pendingOrder.razorpayOrderId);

  const expectedAmount = Math.round(Number(pendingOrder.totalAmount) * 100);

  if (
    razorpayOrder.id !== pendingOrder.razorpayOrderId ||
    razorpayOrder.amount !== expectedAmount ||
    razorpayOrder.currency !== "INR" ||
    !["created", "attempted"].includes(razorpayOrder.status)
  ) {
    return res.status(409).json({
      error:
        "Existing payment order cannot be reused. Please retry checkout.",
    });
  }

  return res.status(200).json({
    data: {
      orderId: pendingOrder.orderId,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      totalAmount: Number(pendingOrder.totalAmount),
    },
  });
}

}

    // Apply the current shipping rule
    const subtotal = items.reduce(
      (acc, item) => acc + Number(item.price) * item.quantity,
      0,
    );

    const shipping = subtotal > 49 ? 0 : 19;
    const total = subtotal + shipping;

    if(paymentMethod === "cash-on-delivery"){
      const order = await db.transaction(async (tx)=> {
        const [createdOrder] = await tx.insert(orders).values({
          addressId: parsedAddressId,
          userId,
          status: "pending",
          totalAmount: String(total)
        })
        .returning({id: orders.id, createdAt: orders.createdAt})

        if(!createdOrder){
          throw new Error("Failed to create Order.")
        }

        await tx.insert(orderItems).values(
          items.map((item)=> ({
            orderId: createdOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: String(item.price)
          }))
        )

        await tx.insert(payments).values({
          orderId: createdOrder.id,
          amount: String(total),
          provider: "cash-on-delivery",
          providerOrderId: null,
          status: "pending",
          providerPaymentId: null
        })

        return createdOrder
      })


      await db.delete(cartItems).where(eq(cartItems.cartId, cart.id));

      return res.status(201).json({
        data: {
          orderId: order.id,
          totalAmount: total,
          paymentMethod: "cash-on-delivery",
          paymentStatus: "pending",
          orderDate: order.createdAt.toISOString()

        }
      })
    }

    // Create the provider-side order before saving our payment record so both
    // records can be linked through Razorpay's order ID.
    const razorpayOrder = await createRazorpayOrder({
      amount: total,
      receipt: `TRZ_ORDER_${Date.now()}`,
    });

    // Keep the order, its line items, and the initial payment record together.
    // If any insert fails, the transaction rolls back the database changes.
    const order = await db.transaction(async (tx) => {
      const [createdOrder] = await tx
        .insert(orders)
        .values({
          addressId: parsedAddressId,
          userId,
          status: "pending",
          totalAmount: String(total),
        })
        .returning({ id: orders.id });
      if (!createdOrder) {
        throw new Error("Failed to create order");
      }

      await tx.insert(orderItems).values(
        items.map((item) => ({
          orderId: createdOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          price: String(item.price),
        })),
      );

      // The payment starts as pending and will be updated after Razorpay
      // confirms the payment through the payment callback/webhook flow.
      await tx.insert(payments).values({
        orderId: createdOrder.id,
        amount: String(total),
        provider: "razorpay",
        providerOrderId: razorpayOrder.id,
        status: "pending",
        providerPaymentId: null,
      });
      return createdOrder;
    });

    return res.status(201).json({
      data: {
        orderId: order.id,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        totalAmount: total,
      },
    });
  } catch (error) {
    console.error("POST /orders error:", error);
    return res.status(500).json({ error: "Failed to create order" });
  }
};
