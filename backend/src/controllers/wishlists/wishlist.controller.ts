import type { Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "../../db/index.js";
import { auth } from "../../lib/auth.js";
import {
  productImages,
  products,
  wishlistItems,
  wishlists,
} from "../../db/schema/app.js";

// GET /api/wishlist - Get the current user's wishlist and items
export const getWishlist = async (req: Request, res: Response) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const [wishlist] = await db
      .select()
      .from(wishlists)
      .where(eq(wishlists.userId, session.user.id))
      .limit(1);

    if (!wishlist) {
      return res.status(200).json({
        data: {
          items: [],
        },
      });
    }

    const items = await db
      .select({
        id: wishlistItems.id,
        createdAt: wishlistItems.createdAt,
        updatedAt: wishlistItems.updatedAt,
        product: products,
      })
      .from(wishlistItems)
      .innerJoin(products, eq(wishlistItems.productId, products.id))
      .where(eq(wishlistItems.wishlistId, wishlist.id));

    if (items.length === 0) {
      return res.status(200).json({
        data: {
          ...wishlist,
          items: [],
        },
      });
    }

    const productIds = items.map((item) => item.product.id);
    const wishlistItemsImages = await db
      .select()
      .from(productImages)
      .where(inArray(productImages.productId, productIds));

    const wishlistItemsWithImages = items.map((item) => ({
      ...item,
      images: wishlistItemsImages.filter(
        (image) => image.productId === item.product.id,
      ),
    }));

    return res.status(200).json({
      data: {
        ...wishlist,
        items: wishlistItemsWithImages,
      },
    });
  } catch (error) {
    console.error("GET /wishlist error:", error);
    return res.status(500).json({ error: "Failed to fetch wishlist" });
  }
};

// POST /api/wishlist/items - Add a product to the current user's wishlist
export const addWishlistItem = async (req: Request, res: Response) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { productId } = req.body;

    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const [product] = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.id, productId));

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    let wishlistId: number;
    const [wishlist] = await db
      .select({ id: wishlists.id })
      .from(wishlists)
      .where(eq(wishlists.userId, session.user.id))
      .limit(1);

    if (!wishlist) {
      const [createdWishlist] = await db
        .insert(wishlists)
        .values({ userId: session.user.id })
        .returning({ id: wishlists.id });

      if (!createdWishlist) {
        return res.status(500).json({ error: "Failed to create wishlist" });
      }

      wishlistId = createdWishlist.id;
    } else {
      wishlistId = wishlist.id;
    }

    const [existingWishlistItem] = await db
      .select()
      .from(wishlistItems)
      .where(
        and(
          eq(wishlistItems.wishlistId, wishlistId),
          eq(wishlistItems.productId, productId),
        ),
      );

    if (existingWishlistItem) {
      return res.status(409).json({
        error: "Product is already in the wishlist",
        data: existingWishlistItem,
      });
    }

    const [createdWishlistItem] = await db
      .insert(wishlistItems)
      .values({
        wishlistId,
        productId,
      })
      .returning();

    return res.status(201).json({
      data: createdWishlistItem,
    });
  } catch (error) {
    console.error("POST /wishlist/items error:", error);
    return res.status(500).json({ error: "Failed to add wishlist item" });
  }
};

// DELETE /api/wishlist/items/:id - Delete an item from the current user's wishlist
export const deleteWishlistItem = async (req: Request, res: Response) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const wishlistItemId = Number(req.params.id);

    if (!Number.isInteger(wishlistItemId) || wishlistItemId <= 0) {
      return res.status(400).json({ error: "Invalid wishlist item ID" });
    }

    const [wishlistItem] = await db
      .select({ id: wishlistItems.id })
      .from(wishlistItems)
      .innerJoin(wishlists, eq(wishlistItems.wishlistId, wishlists.id))
      .where(
        and(
          eq(wishlistItems.id, wishlistItemId),
          eq(wishlists.userId, session.user.id),
        ),
      );

    if (!wishlistItem) {
      return res.status(404).json({ error: "Wishlist item not found" });
    }

    await db
      .delete(wishlistItems)
      .where(eq(wishlistItems.id, wishlistItem.id));

    return res.status(200).json({
      message: "Wishlist item deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /wishlist/items/:id error:", error);
    return res.status(500).json({ error: "Failed to delete wishlist item" });
  }
};