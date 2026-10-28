import { createOrderApiResponse, OrderDetailResponse, OrdersResponse } from "@/types/types";
import { apiFetch } from "./client";
import { toast } from "@/components/ui/toast";


export async function getOrders(page: number, limit: number) {
  try {
    const response = await apiFetch<OrdersResponse>("Get Orders", `api/orders?page=${page}&limit=${limit}`, {
      credentials: "include",
      method: "GET",
    });
    return response;
  } catch (error) {
    if (error instanceof Error) {
      toast.add({
        type: "error",
        title: "Error",
        description: error.message,
      });
    }
    toast.add({
      type: "error",
      description: "Something went wrong",
    });
  }
}


export async function getOrderById(orderId: number) {
  try {
    const response = await apiFetch<OrderDetailResponse>("Get Order by ID", `api/orders/${orderId}`, {
      credentials: "include",
      method: "GET",
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      toast.add({
        type: "error",
        title: "Error",
        description: error.message,
      });
    }
    toast.add({
      type: "error",
      description: "Something went wrong",
    });
  }
}


export async function createOrder({
  addressId,
  paymentMethod,
}: {
  addressId: number;
  paymentMethod: string;
}) {
  try {
    const response = await apiFetch<createOrderApiResponse>(
      "Create Order",
      "api/orders",
      {
        credentials: "include",
        method: "POST",
        body: JSON.stringify({
          addressId,
          paymentMethod,
        }),
      },
    );

    
    const d = response.data;
    
    const valid =
    paymentMethod === "cash-on-delivery"
    ? Boolean(d.orderId && d.totalAmount)
    : Boolean(d.amount && d.currency && d.orderId && d.razorpayOrderId && d.totalAmount);
    
    if(!valid){
    toast.add({
      type: "error",
      description: "Invalid response from server",
    });
    throw new Error("Invalid response from server");
  }
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      toast.add({
        type: "error",
        title: "Error",
        description: error.message,
      });
    }
    toast.add({
      type: "error",
      description: "Something went wrong",
    });
  }
}
