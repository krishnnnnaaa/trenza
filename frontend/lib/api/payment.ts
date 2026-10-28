import { verifyPaymentApiResponse } from "@/types/types";
import { apiFetch } from "./client";
import { toast } from "@/components/ui/toast";

export async function verifyPayment({
    razorpay_payment_id, 
    razorpay_order_id, 
    razorpay_signature 
}: {
    razorpay_payment_id: string, razorpay_order_id: string, razorpay_signature: string
}) {
  try {
    const response = await apiFetch<verifyPaymentApiResponse>(
      "Verify Payment",
      "api/payment/verify",
      {
        credentials: "include",
        method: "POST",
        body: JSON.stringify({
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature
        }),
      },
    );

    if (!response || response.status !== 200){
        toast.add({
            type: "error",
            description: "Payment verification failed.",
        });
        throw new Error("Payment verification failed.");
    }

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
