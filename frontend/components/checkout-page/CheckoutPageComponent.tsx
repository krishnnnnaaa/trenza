"use client";

import {
  AddressApiResponse,
  CartResponse,
  CheckoutStep,
  OrderPaymentSummary,
  PaymentMethod,
  PostPaymentResponse,
} from "@/types/types";
import React, { useEffect, useState } from "react";
import { CheckoutStepper } from "./CheckoutStepper";
import AddressStep from "./address/AddressStep";
import { toast } from "../ui/toast";
import { getAddress } from "@/lib/api/address";
import ReviewStep from "./review/ReviewStep";
import { getCart } from "@/lib/api/cart";
import PaymentStep from "./payment/PaymentStep";
import ConfirmationStep from "./confirmation-page/ConfirmationStep";
import { getCheckoutState } from "@/lib/api/checkouts";
import { useRouter, useSearchParams } from "next/navigation";

const CheckoutPageComponent = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [address, setAddress] = useState<AddressApiResponse[]>([]);
  const [addressLoading, setAddressLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] =
    useState<AddressApiResponse | null>(null);
  const [resumeAddressId, setResumeAddressId] = useState<number | null>(null);
  const [currentStep, setCurrentStep] =
    useState<CheckoutStep>("address");
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("online");
  const [postPaymentResponse, setPostPaymentResponse] =
    useState<PostPaymentResponse | null>(null);
    const [isRestoringConfirmation, setIsRestoringConfirmation] =
  useState(true);
  const [confirmationItems, setConfirmationItems] =
  useState<CartResponse["data"]["items"]>([]);

  const [orderPaymentSummary, setOrderPaymentSummary] =
    useState<OrderPaymentSummary | null>(null);


  useEffect(() => {
    const restoreConfirmation = () => {
      const storedOrder = sessionStorage.getItem("t_order");

      if (!storedOrder) {
        if (params.get("purchase") === "success") {
          router.replace("/");
        }

        setIsRestoringConfirmation(false);
        return;
      }

      try {
        const saved = JSON.parse(storedOrder);
        const purchase = params.get("purchase");
        const orderIdFromUrl = params.get("orderId");

        if (purchase === "success") {
          if (!orderIdFromUrl) {
            router.replace("/");
            return;
          }

          if (
            !saved.orderId ||
            String(saved.orderId).split("#")[0] !== orderIdFromUrl
          ) {
            router.replace("/");
            return;
          }

          setPostPaymentResponse({
            orderId: Number(orderIdFromUrl),
            razorpayOrderId: saved.razorpayOrderId,
            totalAmount: saved.totalAmount,
            paymentStatus: saved.paymentStatus,
            orderDate: saved.orderDate,
            paidAt: saved.paidAt,
            razorpayPaymentId: saved.razorpayPaymentId ?? null,
          });

          setPaymentMethod(saved.paymentMethod);
          setSelectedAddress(saved.address);
          setConfirmationItems(saved.items ?? []);
          setOrderPaymentSummary(saved.orderPaymentSummary ?? null);
          setCurrentStep("confirmation");
        } else {
          setCurrentStep("address");
        }
      } catch (error) {
        console.error("Failed to restore saved order:", error);

        if (params.get("purchase") === "success") {
          router.replace("/");
        }
      } finally {
        setIsRestoringConfirmation(false);
      }
    };

    restoreConfirmation();
  }, [params, router]);

  // --------------------------------------------------
  // Fetch addresses
  // --------------------------------------------------

  useEffect(() => {
    async function fetchAddress() {
      try {
        const response = await getAddress();

        if (response?.data) {
          setAddress(response.data);
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.add({
            type: "warning",
            description: error.message,
          });
        }

        toast.add({
          type: "error",
          description: "Failed to fetch addresses.",
        });

        console.error("Error fetching address:", error);
      } finally {
        setAddressLoading(false);
      }
    }

    fetchAddress();
  }, []);


  // --------------------------------------------------
  // Restore selected address when resuming payment
  // --------------------------------------------------

  useEffect(() => {
    const restoreSelectedAddress = () => {
      if (resumeAddressId === null || address.length === 0) {
        return;
      }

      const matchedAddress = address.find(
        (item) => item.id === resumeAddressId
      );

      if (matchedAddress) {
        setSelectedAddress(matchedAddress);
      }
    };

    restoreSelectedAddress();
  }, [address, resumeAddressId]);

  // --------------------------------------------------
  // Handle newly created address
  // --------------------------------------------------

  const handleAddressCreated = (
    newAddress: AddressApiResponse
  ) => {
    setAddress((prev) => {
      const exists = prev.some(
        (addr) => addr.id === newAddress.id
      );

      if (!exists) {
        return [...prev, newAddress];
      }

      return prev.map((addr) => {
        if (addr.id === newAddress.id) {
          return newAddress;
        }

        if (newAddress.isDefault) {
          return {
            ...addr,
            isDefault: false,
          };
        }

        return addr;
      });
    });
  };

  // --------------------------------------------------
  // Fetch cart
  // --------------------------------------------------

  useEffect(() => {
    async function fetchCart() {
      try {
        const response = await getCart();

        if (response?.data.items) {
          setCart(response);
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.add({
            type: "warning",
            description: error.message,
          });
        }

        toast.add({
          type: "error",
          description: "Failed to fetch cart.",
        });

        console.error("Error fetching cart:", error);
      }
    }

    fetchCart();
  }, []);

  // --------------------------------------------------
  // Fetch checkout state
  // --------------------------------------------------

  useEffect(() => {
    async function fetchCheckoutState() {
      if (isRestoringConfirmation) return;


      // Success URL is handled by the confirmation restoration effect.
  // Don't let checkout state overwrite its redirect or confirmation.
  if (params.get("purchase") === "success") return;


      try {
        let orderId = params.get("orderId") || "";
        let isStoredOrderId = false;

        // If query param is not present,
        // try the current checkout order from sessionStorage.
        if (!orderId) {
          const fallbackId =
            sessionStorage.getItem("ttiml_id");

          if (fallbackId) {
            orderId = fallbackId;
            isStoredOrderId = true;
          }
        }

        const endpoint = orderId
          ? `api/checkout/state?orderId=${orderId}`
          : `api/checkout/state`;

        const response = await getCheckoutState(endpoint);

        const checkoutState = response?.data;
        const state = checkoutState?.state;

        // ----------------------------------------------
        // Address
        // ----------------------------------------------

        if (state === "address") {
          setCurrentStep("address");
          return;
        }

        // ----------------------------------------------
        // Payment
        // ----------------------------------------------

        if (state === "payment") {
          setResumeAddressId(checkoutState.addressId);
          setCurrentStep("payment");
          return;
        }

        // ----------------------------------------------
        // Review
        // ----------------------------------------------

        if (state === "review") { 
          setCurrentStep("review");
          return;
        }

        // ----------------------------------------------
        // Confirmation
        // ----------------------------------------------

        if (state === "confirmation") {
          if (isStoredOrderId) {
            sessionStorage.removeItem("ttiml_id");
            setCurrentStep("address");
            return;
          }

          setCurrentStep("confirmation");
          return;
        }

        // ----------------------------------------------
        // Empty cart
        // ----------------------------------------------

        if (state === "empty") {
          router.push("/cart");
          return;
        }

        // ----------------------------------------------
        // Invalid / unknown state
        // ----------------------------------------------

        if (state === "invalid") {
          if (isStoredOrderId) {
            sessionStorage.removeItem("ttiml_id");
          }

          toast.add({
            type: "error",
            description:
              checkoutState?.message ||
              "Unable to restore checkout state.",
          });

          return;
        }
      } catch (error) {
        console.error(
          "Error fetching checkout state:",
          error
        );

        toast.add({
          type: "error",
          description: "Failed to restore checkout.",
        });
      }
    }

    fetchCheckoutState();
 }, [params, router, isRestoringConfirmation]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="w-[80%] mx-auto">
        <CheckoutStepper
          currentStep={currentStep}
          onStepChange={setCurrentStep}
        />
      </div>

      {currentStep === "address" && (
        <AddressStep
          setSelectedAddress={setSelectedAddress}
          addressLoading={addressLoading}
          onAddressCreated={handleAddressCreated}
          address={address}
          onComplete={() => setCurrentStep("review")}
        />
      )}

      {currentStep === "review" && (
        <ReviewStep
          cart={cart}
          selectedAddress={selectedAddress}
          onComplete={setCurrentStep}
          setOrderPaymentSummary={setOrderPaymentSummary}
        />
      )}

      {currentStep === "payment" && (
        <PaymentStep
          setPostPaymentResponse={setPostPaymentResponse}
          cart={cart}
          selectedAddress={selectedAddress}
          setPaymentMethod={setPaymentMethod}
          paymentMethod={paymentMethod}
          onComplete={setCurrentStep}
        />
      )}

     {currentStep === "confirmation" &&
  selectedAddress &&
  postPaymentResponse && (
    <ConfirmationStep
      paymentMethod={paymentMethod}
      orderPaymentSummary={orderPaymentSummary}
      address={selectedAddress}
      items={confirmationItems}
      postPaymentResponse={postPaymentResponse}
    />
)}
    </div>
  );
};

export default CheckoutPageComponent;