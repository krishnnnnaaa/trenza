import {
  AddWishlistItemApiResponse,
  DeleteWishlistItemApiResponse,
  WishlistApiResponse,
} from "@/types/types";
import { toast } from "@/components/ui/toast";
import { ApiError, apiFetch } from "./client";

export async function getWishlist(endpoint = "api/wishlist") {
  return apiFetch<WishlistApiResponse>("Get Wishlist", endpoint, {
    credentials: "include",
    method: "GET",
  });
}

export async function addWishlistItem(productId: number) {
  try {
    return await apiFetch<AddWishlistItemApiResponse>(
      "Add Wishlist Item",
      "api/wishlist/items",
      {
        credentials: "include",
        method: "POST",
        body: JSON.stringify({ productId }),
      },
    );
  } catch (error) {
    showWishlistError(error);
  }
}

export async function deleteWishlistItem(wishlistItemId: number) {
  try {
    return await apiFetch<DeleteWishlistItemApiResponse>(
      "Delete Wishlist Item",
      `api/wishlist/items/${wishlistItemId}`,
      {
        credentials: "include",
        method: "DELETE",
      },
    );
  } catch (error) {
    showWishlistError(error);
  }
}

function showWishlistError(error: unknown) {
  if (error instanceof ApiError) {
    
    toast.add({
      type: "error",
      title: "Error",
      description: error.message,
    });
    return;
  }

  toast.add({
    type: "error",
    description: "Something went wrong",
  });
}