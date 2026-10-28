import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { fraunces } from "@/fonts/fonts";
import {
  AddressApiResponse,
  CartResponse,
  CheckoutStep,
  PaymentMethod,
  PostPaymentResponse,
  RazorpayPaymentResponse,
} from "@/types/types";
import React, { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PAYMENT_METHODS } from "@/lib/constants/paymentMethod";
import { createOrder } from "@/lib/api/order";
import Script from "next/script";
import { toast } from "@/components/ui/toast";
import { verifyPayment } from "@/lib/api/payment";
import { useRouter } from "next/navigation";
import { useShop } from "@/app/context/ShopContent";
import { CodConfirmingModal } from "./CodConfirmingModal";

interface PaymentStepProps {
  onComplete: React.Dispatch<React.SetStateAction<CheckoutStep>>;
  cart: CartResponse | null;
  selectedAddress: AddressApiResponse | null;
  setPaymentMethod: React.Dispatch<React.SetStateAction<PaymentMethod>>;
  paymentMethod: PaymentMethod;
  setPostPaymentResponse: React.Dispatch<
    React.SetStateAction<PostPaymentResponse | null>
  >;
}

const isStaticImageData = (
  icon: StaticImageData | React.ElementType,
): icon is StaticImageData =>
  typeof icon === "object" && icon !== null && "src" in icon;

const PaymentIcon = ({
  icon,
  alt = "",
  size = "primary",
}: {
  icon: StaticImageData | React.ElementType;
  alt?: string;
  size?: "primary" | "brand";
}) =>
  isStaticImageData(icon) ? (
    <Image
      src={icon}
      alt={alt}
      width={size === "brand" ? 56 : 42}
      height={size === "brand" ? 32 : 42}
      className={
        size === "brand" ? "h-7 w-12 object-contain" : "h-9 w-9 object-contain"
      }
    />
  ) : (
    React.createElement(icon, {
      className:
        size === "brand" ? "h-7 w-10 text-[#17181A]" : "h-9 w-9 text-[#17181A]",
    })
  );

const PaymentStep = ({
  onComplete,
  cart,
  paymentMethod,
  setPaymentMethod,
  selectedAddress,
  setPostPaymentResponse,
}: PaymentStepProps) => {
  const COD_MODAL_MS = 1400;
  const router = useRouter();
  const { fetchCartCount } = useShop();

  const [isProcessing, setIsProcessing] = useState(false);
  const items = cart?.data.items ?? [];

  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  const [showCodModal, setShowCodModal] = useState(false);
  const isCod = paymentMethod === "cash-on-delivery";
  const shipping = subtotal > 49 ? 0 : 19;
  const total = subtotal + shipping;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

   async function handleCodOrder() {
  setIsProcessing(true);
  try {
    const response = await createOrder({
      addressId: selectedAddress?.id ?? 0,
      paymentMethod,
    });

    // helper already toasts on failure and returns undefined
    if (!response?.orderId) {
      setIsProcessing(false);
      return;
    }

    sessionStorage.removeItem("ttiml_id");

     setPostPaymentResponse({
      orderId: response.orderId,
      razorpayOrderId: response.razorpayOrderId,
      totalAmount: response.totalAmount,
      paymentStatus: "pending", // backend creates a pending payment record for COD
      orderDate: response.orderDate,
    });

    const dataInlined = {
      orderId: `${response.orderId}#${cart?.data.userId}`,
      razorpayOrderId: response.razorpayOrderId,
      totalAmount: response.totalAmount,
      paymentStatus: "pending",
      orderDate: response.orderDate,
      paymentMethod: paymentMethod,
      address: selectedAddress,
      items: items,
      orderPaymentSummary: {
    subtotal,
    shipping,
    totalAmount: total,
    currency: "INR",
    paidAt: null,
  },
    }

    sessionStorage.setItem("t_order", JSON.stringify(dataInlined));

    setShowCodModal(true); // only after the backend really created the order
    await new Promise((resolve) => setTimeout(resolve, COD_MODAL_MS));

    await fetchCartCount?.();
    onComplete("confirmation");
    router.push(`/checkout?purchase=success&orderId=${response.orderId}`);
    // PaymentStep unmounts here, so the modal closes with it
  } catch (error) {
    setShowCodModal(false);
    setIsProcessing(false);
    toast.add({
      type: "error",
      title: "Order failed",
      description:
        error instanceof Error ? error.message : "Something went wrong. Please try again.",
    });
  }
}
  async function handlePayment() {
    if (isProcessing) return;
    if (isCod) return handleCodOrder();
    setIsProcessing(true);

    localStorage.setItem("trenza_status", "initiated");
    try {
      const response = await createOrder({
        addressId: selectedAddress?.id ?? 0,
        paymentMethod: paymentMethod,
      });

      
      const razorpayOderId = response?.razorpayOrderId;
      const amount = response?.amount;
      const currency = response?.currency;
      const orderId = response?.orderId;

      if (!razorpayOderId || !amount || !currency || !orderId) {
        throw new Error("Invalid response from server");
      }

      sessionStorage.setItem("ttiml_id", orderId.toString());
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount,
        currency,
        name: "Trenza",
        description: "Order Payment",
        order_id: razorpayOderId,
        modal: {
          ondismiss: () => {
            localStorage.removeItem("trenza_status");
            setIsProcessing(false);

            toast.add({
              type: "info",
              title: "Payment cancelled",
              description: "You closed the payment window. You can try again.",
            });
          },
        },
        handler: async (response: RazorpayPaymentResponse) => {
          try {
            const result = await verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (result?.status !== 200) {
              throw new Error("Payment verification failed.");
            }

            sessionStorage.removeItem("ttiml_id");

            setPostPaymentResponse({ ...result.data });
            const confirmationData = {
  orderId: `${result.data.orderId}#${cart?.data.userId}`,
  totalAmount: result.data.totalAmount,
  paymentStatus: result.data.paymentStatus,
  orderDate: result.data.orderDate,
  razorpayOrderId: result.data.razorpayOrderId,
  razorpayPaymentId: result.data.razorpayPaymentId,
  paymentMethod,
  address: selectedAddress,
  items,
  paidAt: result.data.paidAt,
  orderPaymentSummary: {
    subtotal,
    shipping,
    totalAmount: total,
    currency: "INR",
  },
};

sessionStorage.setItem("t_order", JSON.stringify(confirmationData));
            localStorage.removeItem("trenza_status");

            await fetchCartCount?.();

            onComplete("confirmation");
            router.push(
              `/checkout?purchase=success&orderId=${result.data.orderId}`,
            );

            toast.add({
              type: "success",
              description: result.message,
            });
          } catch (error) {
  setIsProcessing(false);

  toast.add({
    type: "error",
    title: "Payment error",
    description:
      error instanceof Error
        ? error.message
        : "Something went wrong. Please try again.",
  });
}
        },
      };

      const razorpay = new window.Razorpay(options);
      const razorpayWithEvents = razorpay as typeof razorpay & {
        on: (event: string, callback: () => void) => void;
      };

      razorpayWithEvents.on("payment.failed", () => {
        setIsProcessing(false);

        toast.add({
          type: "error",
          title: "Payment failed",
          description:
            "Payment could not be completed. Please check your order status before retrying.",
        });
      });

      razorpay.open();
} catch (error) {
  localStorage.removeItem("trenza_status");
  setIsProcessing(false);

  toast.add({
    type: "error",
    title: "Payment error",
    description:
      error instanceof Error
        ? error.message
        : "Something went wrong. Please try again.",
  });
}
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
      <CodConfirmingModal open={showCodModal} durationMs={COD_MODAL_MS} />
      <div className={`w-full px-4 py-5 sm:p-7 ${fraunces.variable}`}>
        <div>
          <h1
            className="text-2xl tracking-tight text-[#17181A] sm:text-4xl"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Payment Method
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#857F73]">
            Choose your preferred payment method and complete your purchase
            securely.
          </p>
        </div>

        {/* Main Content */}
        <div className="mt-6 grid gap-6 lg:mt-7 grid-cols-[1fr] lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-8">
          <div>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) =>
                setPaymentMethod(value as PaymentMethod)
              }
              className=""
            >
              {PAYMENT_METHODS.map((method) => (
                <label
                  key={method.id}
                  htmlFor={`payment-${method.id}`}
                  className={`mb-3 flex min-h-22 flex-wrap cursor-pointer items-center gap-3 rounded-lg border bg-[#FAF8F5] px-3 py-3 transition-shadow hover:shadow-md sm:flex-nowrap sm:gap-4 sm:px-6 sm:py-4 ${
                    paymentMethod === method.id
                      ? "border-[#454F45] shadow-sm"
                      : "border-[#E3DFD8]"
                  }`}
                >
                  <RadioGroupItem
                    value={method.id}
                    id={`payment-${method.id}`}
                    className="h-6 w-6 shrink-0 border-[#B9BCBD] data-[state=checked]:border-[#454F45] data-[state=checked]:bg-[#454F45]"
                  />
                  <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#F1EEE8] sm:h-12 sm:w-12">
                      <PaymentIcon
                        icon={method.icon}
                        alt={`${method.title} icon`}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#17181A] sm:text-base">
                        {method.title}
                      </p>
                      <p className="text-xs text-[#857F73] sm:text-sm">
                        {method.subtitle}
                      </p>
                      {method.note && (
                        <p className="mt-0.5 text-xs text-[#857F73]">
                          {method.note}
                        </p>
                      )}
                    </div>
                  </div>
                  {method.subIcons && (
                    <div className="ml-auto flex w-full items-center justify-end gap-1.5 sm:w-auto sm:gap-2">
                      {method.subIcons.map((icon, index) => (
                        <span
                          key={`${method.id}-sub-icon-${index}`}
                          className="flex h-9 w-14 items-center justify-center rounded-md border border-[#E3DFD8] bg-white px-1 sm:h-11 sm:w-18"
                        >
                          <PaymentIcon icon={icon} alt="" size="brand" />
                        </span>
                      ))}
                    </div>
                  )}
                </label>
              ))}
            </RadioGroup>
            <div className="mt-5 flex items-start gap-3 rounded-lg border border-[#E2EAD8] bg-[#F1F6EB] px-4 py-4 sm:items-center sm:gap-4 sm:px-5">
              <ShieldCheck
                className="h-8 w-8 shrink-0 text-[#3E8748]"
                aria-hidden="true"
              />
              <div>
                <p className="text-sm font-medium text-[#2F5735]">
                  Your payment information is secure
                </p>
                <p className="mt-1 text-xs text-[#6E786D]">
                  We use secure payment processing. Your card and bank details
                  are never stored on our servers.
                </p>
              </div>
            </div>
          </div>
          <div>
            {/* LEFT */}
            <div className="min-w-0 space-y-6">
              <section className="rounded-md border border-[#E3DFD8] bg-white">
                <div className="divide-y divide-[#E3DFD8]">
                  <h2 className="text-base p-4 font-semibold text-[#17181A]">
                    Order Summary
                  </h2>
                  {items.length === 0 ? (
                    <div className="px-5 py-8 text-center">
                      <p className="text-sm text-[#857F73]">
                        Your cart is empty.
                      </p>
                    </div>
                  ) : (
                    items.map((item) => {
                      const primaryImage =
                        item.images.find((image) => image.isPrimary) ??
                        item.images[0];

                      const itemTotal = item.product.price * item.quantity;

                      return (
                        <div
                          key={item.id}
                          className="flex gap-3 px-3 py-4 sm:gap-4 sm:px-5"
                        >
                          {/* Product Image */}
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-[#E3DFD8] bg-[#FAF8F5] sm:h-20 sm:w-20">
                            {primaryImage ? (
                              <Link
                                href={`/shop/${item.product.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Image
                                  src={primaryImage.url}
                                  alt={item.product.name}
                                  fill
                                  sizes="80px"
                                  className="object-contain p-2"
                                />
                              </Link>
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs text-[#857F73]">
                                No image
                              </div>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2 sm:gap-4">
                              <div className="min-w-0">
                                <Link
                                  href={`/shop/${item.product.slug}`}
                                  target="_blank"
                                  className="block truncate text-sm font-medium text-[#17181A]"
                                >
                                  {item.product.name}
                                </Link>

                                {item.product.brand && (
                                  <p className="mt-0.5 text-xs text-[#857F73]">
                                    {item.product.brand}
                                  </p>
                                )}

                                <p className="mt-1 text-xs text-[#857F73]">
                                  Qty: {item.quantity}
                                </p>
                              </div>

                              <div className="shrink-0 text-right">
                                <p className="text-sm font-medium text-[#17181A]">
                                  {formatPrice(itemTotal)}
                                </p>

                                {item.quantity > 1 && (
                                  <p className="mt-0.5 text-xs text-[#857F73]">
                                    {formatPrice(item.product.price)} each
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </section>
            </div>

            {/* RIGHT - ORDER SUMMARY */}
            <aside className="lg:sticky lg:top-24">
              <div className="rounded-md border border-[#E3DFD8] bg-white p-5">
                <h2 className="text-base font-semibold text-[#17181A]">
                  Billing
                </h2>
                <div className="my-4 border-t border-[#E3DFD8]" />
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="min-w-0 pr-3 text-[#857F73]">
                      Subtotal (
                      {items.reduce((total, item) => total + item.quantity, 0)}{" "}
                      items)
                    </span>

                    <span className="shrink-0 font-medium text-[#17181A]">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#857F73]">Shipping</span>

                    <span className="font-medium text-[#454F45]">
                      {shipping === 0 ? "FREE" : formatPrice(shipping)}
                    </span>
                  </div>
                </div>

                <div className="my-4 border-t border-[#E3DFD8]" />

                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-[#17181A]">
                    Total
                  </span>

                  <span className="text-lg font-semibold text-[#17181A]">
                    {formatPrice(total)}
                  </span>
                </div>

                <button
                  type="button"
                  disabled={!paymentMethod || isProcessing}
                  onClick={handlePayment}
                  className="mt-5 group flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#332F2A] px-5 text-sm font-medium text-white transition-colors hover:bg-[#454F45] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
                >
                  {isProcessing ?
                   isCod ? "Placing Order..." : "Processing..." :
                  isCod ? "Place Order" : "Pay " + formatPrice(total)}
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </aside>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-4 pt-1 lg:mt-0">
          <button
            type="button"
            onClick={() => onComplete("review")}
            className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-md border border-[#E3DFD8] bg-white px-4 text-sm font-medium text-[#17181A] transition-colors hover:bg-[#F0EDE7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2 sm:w-auto sm:px-5"
          >
            <ArrowLeft
              className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            Back to Review
          </button>
        </div>
      </div>
    </>
  );
};

export default PaymentStep;
