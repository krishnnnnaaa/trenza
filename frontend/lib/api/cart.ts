import { CartResponse } from "@/types/types";
import { ApiError, apiFetch } from "./client";
import { toast } from "@/components/ui/toast";

export async function getCart() {
  try {
    const response = await apiFetch<CartResponse>("Get Cart", "api/cart", {
      credentials: "include"
    });
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      toast.add({
        type: "error",
        title: "Error",
        description: error.message,
      });
    } else {
      toast.add({
        type: "error",
        description: "Something went wrong",
      });
    }
    throw error;
  }
}


export async function addProductToCart(productId: number, quantity: number) {
  try {
    const response = await apiFetch<CartResponse>("Add To Cart", "api/cart/add", {
      credentials: "include",
      method: "POST",
      body: JSON.stringify({
        productId,
        quantity
      })
    });
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      toast.add({
        type: "error",
        title: "Error",
        description: error.message,
      });
    } else {
      toast.add({
        type: "error",
        description: "Something went wrong",
      });
    }
    throw error;
  }
}


export async function updateCartItemQuantity(quantity: number, cartItemId: number) {
  try {
    const response = await apiFetch<CartResponse>("Update quantity", `api/cart/items/${cartItemId}`, {
      credentials: "include",
      method: "PATCH",
      body: JSON.stringify({
        quantity
      })
    });
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      toast.add({
        type: "error",
        title: "Error",
        description: error.message,
      });
    } else {
      toast.add({
        type: "error",
        description: "Something went wrong",
      });
    }
    throw error;
  }
}


export async function RemoveCartItem(cartItemId: number) {
  try {
    const response = await apiFetch<CartResponse>("Remove from Cart", `api/cart/items/${cartItemId}`, {
      credentials: "include",
      method: "DELETE",
    });
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      toast.add({
        type: "error",
        title: "Error",
        description: error.message,
      });
    } else {
      toast.add({
        type: "error",
        description: "Something went wrong",
      });
    }
    throw error;
  }
}


export async function ClearCart() {
  try {
    const response = await apiFetch<CartResponse>("Clear Cart", `api/cart/items`, {
      credentials: "include",
      method: "DELETE",
    });
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      toast.add({
        type: "error",
        title: "Error",
        description: error.message,
      });
    } else {
      toast.add({
        type: "error",
        description: "Something went wrong",
      });
    }
    throw error;
  }
}
