import type { Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { and, eq, ilike, inArray } from "drizzle-orm";
import { auth } from "../../lib/auth.js";
import { db } from "../../db/index.js";
import {
  cartItems,
  carts,
  productImages,
  products,
} from "../../db/schema/app.js";

// GET /api/cart - Get Cart and Cart items (if exists)
export const getCart = async (req: Request, res: Response) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const cart = await db
      .select()
      .from(carts)
      .where(eq(carts.userId, session.user.id))
      .limit(1);

    if (cart.length === 0) {
      return res.status(200).json({
        data: {
          items: [],
        },
      });
    }

    const userCart = cart[0]!;
    const items = await db
      .select({
        id: cartItems.id,
        quantity: cartItems.quantity,
        product: products,
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.cartId, userCart.id));

    if (items.length === 0) {
      return res.status(200).json({
        data: {
          ...userCart,
          items: [],
        },
      });
    }
    const productIds = items.map((item) => item.product.id);

    const productItemsImages = await db
      .select()
      .from(productImages)
      .where(inArray(productImages.productId, productIds));

    const productItemsWithImages = items.map((item) => {
      const matchingImage = productItemsImages.filter((imagesItem) => {
        return imagesItem.productId === item.product.id;
      });
      return {
        ...item,
        images: matchingImage,
      };
    });

    return res.status(200).json({
      data: {
        ...userCart,
        items: productItemsWithImages,
      },
    });
  } catch (error) {
    console.error("GET /cart error:", error);
    return res.status(500).json({ error: "Failed to fetch cart" });
  }
};

// POST /api/cart/item - Update the quantity or Create a new Cart if not exists already
export const createCart = async (req: Request, res: Response) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { productId, quantity = 1 } = req.body;

    if (!productId || !Number.isInteger(quantity) || quantity <= 0) {
      return res
        .status(400)
        .json({
          error:
            "Something went wrong with the product selection. Please try again.",
        });
    }

    const [product] = await db
      .select({ id: productId })
      .from(products)
      .where(eq(products.id, productId));

    if (!product) {
      return res
        .status(404)
        .json({
          error: "Product not found. Please try searching product again.",
        });
    }
    let globalCartId: number;

    const [cart] = await db
      .select()
      .from(carts)
      .where(eq(carts.userId, session.user.id))
      .limit(1);

    // create a cart if it doesn't exist already
    if (!cart) {
      const [createdCartId] = await db
        .insert(carts)
        .values({
          userId: session.user.id,
        })
        .returning({ id: carts.id });

      if (createdCartId) {
        globalCartId = createdCartId.id;
      } else {
        return res.status(500).json({
          error: "Failed to create cart",
        });
      }
    } else {
      globalCartId = cart.id;
    }

    const [existingCartItem] = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.cartId, globalCartId),
          eq(cartItems.productId, productId),
        ),
      );

    // create a new cart_item if not exists already
    if (!existingCartItem) {
      const [createdCartItem] = await db
        .insert(cartItems)
        .values({
          cartId: globalCartId,
          productId,
          quantity,
        })
        .returning();
      return res.status(201).json({
        data: createdCartItem,
      });
    }
    // update the quantity of existing cart_item
    else {
      const newQuantity = existingCartItem.quantity + quantity;
      const [updatedCartItem] = await db
        .update(cartItems)
        .set({ quantity: newQuantity, updatedAt: new Date() })
        .where(eq(cartItems.id, existingCartItem.id))
        .returning();

      return res.status(200).json({
        data: updatedCartItem,
      });
    }
  } catch (error) {
    console.error("POST /cart error:", error);
    return res.status(500).json({ error: "Failed to create cart" });
  }
};

// PATCH /api/cart/items/:id - Update the quantity of a cart item
export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const cartItemId = Number(req.params.id);
    const { quantity } = req.body;

    if (!Number.isInteger(cartItemId) || cartItemId <= 0) {
      return res.status(400).json({ error: "Invalid cart item ID" });
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({
        error: "Quantity must be a positive integer",
      });
    }

    const [cartItem] = await db
      .select({ id: cartItems.id })
      .from(cartItems)
      .innerJoin(carts, eq(cartItems.cartId, carts.id))
      .where(
        and(
          eq(cartItems.id, cartItemId),
          eq(carts.userId, session.user.id),
        ),
      );

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    const [updatedCartItem] = await db
      .update(cartItems)
      .set({ quantity, updatedAt: new Date() })
      .where(eq(cartItems.id, cartItem.id))
      .returning();

    return res.status(200).json({
      data: updatedCartItem,
    });
  } catch (error) {
    console.error("PATCH /cart/items/:id error:", error);
    return res.status(500).json({ error: "Failed to update cart item" });
  }
};

// DELETE /api/cart/items/:id - Delete a cart item
export const deleteCartItem = async (req: Request, res: Response) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const cartItemId = Number(req.params.id);

    if (!Number.isInteger(cartItemId) || cartItemId <= 0) {
      return res.status(400).json({ error: "Invalid cart item ID" });
    }

    const [cartItem] = await db
      .select({ id: cartItems.id })
      .from(cartItems)
      .innerJoin(carts, eq(cartItems.cartId, carts.id))
      .where(
        and(
          eq(cartItems.id, cartItemId),
          eq(carts.userId, session.user.id),
        ),
      );

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    await db.delete(cartItems).where(eq(cartItems.id, cartItem.id));

    return res.status(200).json({
      message: "Cart item deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /cart/items/:id error:", error);
    return res.status(500).json({ error: "Failed to delete cart item" });
  }
};


// DELETE /api/cart/items - Clear all cart items
export const clearCart = async (req: Request, res: Response) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    const [cart] = await db
      .select({ id: carts.id })
      .from(carts)
      .where(eq(carts.userId, session.user.id))
      .limit(1);

    // User doesn't have a cart yet, so there's nothing to clear.
    if (!cart) {
      return res.status(200).json({
        message: "Cart is already empty",
      });
    }

    await db
      .delete(cartItems)
      .where(eq(cartItems.cartId, cart.id));

    return res.status(200).json({
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.error("DELETE /cart/items error:", error);

    return res.status(500).json({
      error: "Failed to clear cart",
    });
  }
};