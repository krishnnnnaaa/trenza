import {
  ArrowLeft,
  ArrowRight,
  Pencil,
} from "lucide-react";
import { fraunces } from "@/fonts/fonts";
import {
  AddressApiResponse,
  CartResponse,
  CheckoutStep,
  OrderPaymentSummary,
} from "@/types/types";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { truncateText } from "@/lib/utils";

interface ReviewStepProps {
  onComplete: React.Dispatch<React.SetStateAction<CheckoutStep>>;
  selectedAddress: AddressApiResponse | null;
  cart: CartResponse | null;
  setOrderPaymentSummary: React.Dispatch<React.SetStateAction<OrderPaymentSummary | null>>;
}

const ReviewStep = ({
  onComplete,
  selectedAddress,
  cart,
  setOrderPaymentSummary
}: ReviewStepProps) => {
  const items = cart?.data.items ?? [];

  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  const shipping = subtotal > 49 ? 0 : 19;
  const total = subtotal + shipping;
  useEffect(() => {
    setOrderPaymentSummary({
      currency: "INR",
      subtotal,
      shipping,
      totalAmount: total
    });
  }, [setOrderPaymentSummary, subtotal, shipping, total]);
  

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);


   


  return (
    <div
      className={`w-full p-6 sm:p-7 ${fraunces.variable}`}
    >
      <div>
        <h1
          className="text-3xl tracking-tight text-[#17181A] sm:text-4xl"
          style={{ fontFamily: "var(--font-fraunces)" }}
        >
          Review Your Order
        </h1>

        <p className="mt-2 text-sm leading-6 text-[#857F73]">
          Please review your order and delivery details before proceeding
          to payment.
        </p>
      </div>

      {/* Main Content */}
      <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        {/* LEFT */}
        <div className="min-w-0 space-y-6">
          {/* Delivery Address */}
          {selectedAddress ? (
            <section className="rounded-md border border-[#E3DFD8] bg-white">
              <div className="flex items-center justify-between border-b border-[#E3DFD8] px-5 py-4">
                <h2 className="text-base font-semibold text-[#17181A]">
                  Delivery Address
                </h2>

                <button
                  type="button"
                  onClick={() => onComplete("address")}
                  className="inline-flex items-center gap-1 text-sm text-[#454F45] hover:underline"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
              </div>

              <div className="px-5 py-4">
                <p className="text-sm font-medium text-[#17181A]">
                  {selectedAddress.fullName}
                </p>

                <p className="mt-1 text-sm leading-5 text-[#857F73]">
                  {selectedAddress.addressLine1}
                  {selectedAddress.addressLine2 &&
                    `, ${selectedAddress.addressLine2}`}
                </p>

                <p className="text-sm leading-5 text-[#857F73]">
                  {selectedAddress.city},{" "}
                  {selectedAddress.state} -{" "}
                  {selectedAddress.postalCode}
                </p>

                <p className="mt-1 text-sm text-[#857F73]">
                  {selectedAddress.phone}
                </p>
              </div>
            </section>
          ) : (
            <section className="rounded-md border border-[#E3DFD8] bg-[#FAF8F5] px-5 py-8 text-center">
              <p className="text-sm text-[#857F73]">
                No address selected. Please go back and select an
                address.
              </p>
            </section>
          )}

          {/* Items */}
          <section className="rounded-md border border-[#E3DFD8] bg-white">
            <div className="border-b border-[#E3DFD8] px-5 py-4">
              <h2 className="text-base font-semibold text-[#17181A]">
                Items ({items.length})
              </h2>
            </div>

            <div className="divide-y divide-[#E3DFD8]">
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

                  const itemTotal =
                    item.product.price * item.quantity;

                  return (
                    <div
                      key={item.id}
                      className="flex gap-4 px-5 py-4"
                    >
                      {/* Product Image */}
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-[#E3DFD8] bg-[#FAF8F5]">
                        {primaryImage ? (
                          <Link href={`/shop/${item.product.slug}`} target="_blank" rel="noopener noreferrer">
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
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <Link href={`/shop/${item.product.slug}`} target="_blank" className="truncate text-sm font-medium text-[#17181A]">
                              {truncateText(item.product.name, 10)}
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

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4 pt-1">
            <button
              type="button"
              onClick={() => onComplete("address")}
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-md border border-[#E3DFD8] bg-white px-5 text-sm font-medium text-[#17181A] transition-colors hover:bg-[#F0EDE7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
            >
              <ArrowLeft
                className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
                aria-hidden="true"
              />
              Go back
            </button>

          
          </div>
        </div>

        {/* RIGHT - ORDER SUMMARY */}
        <aside className="lg:sticky lg:top-24">
          <div className="rounded-md border border-[#E3DFD8] bg-white p-5">
            <h2 className="text-base font-semibold text-[#17181A]">
              Order Summary
            </h2>

            <div className="my-4 border-t border-[#E3DFD8]" />

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#857F73]">
                  Subtotal ({items.reduce(
                    (total, item) => total + item.quantity,
                    0,
                  )}{" "}
                  items)
                </span>

                <span className="font-medium text-[#17181A]">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#857F73]">
                  Shipping
                </span>

                <span className="font-medium text-[#454F45]">
                  {shipping === 0
                    ? "FREE"
                    : formatPrice(shipping)}
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
              disabled={!selectedAddress || items.length === 0}
              onClick={() => onComplete("payment")}
              className="mt-5 group flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#332F2A] px-5 text-sm font-medium text-white transition-colors hover:bg-[#454F45] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
            >
              Continue to Payment
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ReviewStep;