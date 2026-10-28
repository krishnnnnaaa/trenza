"use client";

import { Check, Copy, Headset, MapPin, ArrowRight, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format-price";
import { ConfirmationStepProps, PostPaymentStatus } from "@/types/types";
import { truncateText } from "@/lib/utils";

export interface ConfirmationOrderItem {
  id: string;
  name: string;
  imageUrl: string;
  quantity: number;
  price: string;
}

export interface ConfirmationAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString(undefined, options);
}

function statusBadgeClasses(status: PostPaymentStatus) {
  switch (status) {
    case "paid":
      return "bg-[#EEF4EF] text-[#31553E] border border-[#C9DACD]";
    case "pending":
      return "bg-[#F8F2E7] text-[#765522] border border-[#E3D2B3]";
    case "failure":
      return "bg-[#FAEFEE] text-[#843B36] border border-[#E5C7C4]";
  }
}


  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(
      () => {
        // Optionally, you can show a success message or toast here
        console.log("Copied to clipboard:", text);
      },
      (err) => {
        console.error("Failed to copy text: ", err);
      } 
    );
  } 

export default function ConfirmationStep({
  paymentMethod,
  orderPaymentSummary,
  address,
  items,
  postPaymentResponse,
}: ConfirmationStepProps) {
  const isCod = paymentMethod === "cash-on-delivery";
  const {orderDate, orderId, paidAt, paymentStatus, razorpayOrderId, razorpayPaymentId} = postPaymentResponse ?? {};
  const {subtotal, shipping, totalAmount:FinalAmount} = orderPaymentSummary ?? {};
  


  const isFreeShipping = Number.parseFloat(String(shipping)) === 0;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 lg:px-10 lg:py-14">
      {/* Success state */}
      <div className="flex flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EEF4EF]">
          <Check className="h-6 w-6 text-[#3F6B4F]" aria-hidden="true" strokeWidth={2} />
        </span>
        <h1 className="mt-5 font-serif text-3xl font-normal text-[#17181A] sm:text-4xl">
          Order Confirmed!
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-[#857F73]">
         {isCod
            ? "Thank you for your order. Your order is confirmed and you can pay in cash when it's delivered."
            : "Thank you for your purchase. Your payment has been successfully processed and your order is now confirmed."}
        </p>

        <div className="mt-6 flex items-center gap-2 rounded-full bg-[#F0EDE7] px-4 py-2 text-sm text-[#17181A]">
          <span className="text-[#857F73]">Order ID</span>
          <span className="font-medium">{orderId}</span>
          <button
            type="button"
            onClick={() => copyToClipboard(String(orderId))}
            aria-label="Copy order ID"
            className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-sm text-[#857F73] transition-colors duration-150 hover:text-[#454F45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
          >
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
        {orderDate && (
          <span className="mt-2 text-xs text-[#857F73]">Placed on {formatDate(orderDate)}</span>
        )}
        <span className="mt-2 text-xs text-[#857F73]">For shipping details, please visit your order on <Link href="/orders" className="text-[#454F45] hover:underline">your account</Link></span>
      </div>

      {/* Two-column details */}
      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
        {/* Order items */}
        <div className="rounded-lg border border-[#E3DFD8] bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-normal text-[#17181A]">
              Order Items
            </h2>
            <span className="text-sm text-[#857F73]">
              {items.length} {items.length === 1 ? "item" : "items"}
            </span>
          </div>

          <div className="mt-2">
            {items.map((item) => {
                const primaryImage =
                    item.images.find((image) => image.isPrimary) ??
                    item.images[0];

                  const itemTotal =
                    item.product.price * item.quantity;
                    return(
              <div
                      key={item.id}
                      className="flex gap-4 px-5 py-4"
                    >
                      {/* Product Image */}
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-[#E3DFD8] bg-[#FAF8F5]">
                        {item.images[0] ? (
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
                              {formatPrice(String(itemTotal))}
                            </p>

                            {item.quantity > 1 && (
                              <p className="mt-0.5 text-xs text-[#857F73]">
                                {formatPrice(String(item.product.price))} each
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
            )})}
          </div>

          <div className="mt-4 flex flex-col gap-2 border-t border-[#E3DFD8] pt-4 text-sm">
            <div className="flex items-center justify-between text-[#17181A]">
              <span>Subtotal</span>
              <span>{formatPrice(String(subtotal))}</span>
            </div>
            <div className="flex items-center justify-between text-[#17181A]">
              <span>Shipping</span>
              <span>{isFreeShipping ? "FREE" : formatPrice(String(shipping))}</span>
            </div>
          </div>

          <div className="mt-4 flex items-start justify-between border-t border-[#E3DFD8] pt-4">
            <div className="flex flex-col">
              <span className="text-base font-semibold text-[#17181A]">
               {isCod ? "Total Payable" : "Total Paid"}
              </span>
              <span className="text-xs text-[#857F73]">
                (incl. of all taxes)
              </span>
            </div>
            <span className="text-xl font-semibold text-[#17181A]">
              {formatPrice(String(FinalAmount))}
            </span>
          </div>
        </div>

        {/* Address, payment, support */}
        <div className="flex flex-col gap-6">
          <div className="rounded-lg border border-[#E3DFD8] bg-white p-6">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#17181A]" aria-hidden="true" />
              <h2 className="text-sm font-medium text-[#17181A]">
                Delivery Address
              </h2>
            </div>
            <div className="mt-3 flex flex-col gap-0.5 text-sm text-[#857F73]">
              <span className="font-medium text-[#17181A]">{address.fullName}</span>
              <span>{address.addressLine1}</span>
              {address.addressLine2 && <span>{address.addressLine2}</span>}
              <span>
                {address.city}, &ndash; {address.postalCode}
              </span>
              <span>{address.state}, {address.country}</span>
              {address.phone && <span>{address.phone}</span>}
            </div>
          </div>

          <div className="rounded-lg border border-[#E3DFD8] bg-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-[#17181A]" aria-hidden="true" />
                <h2 className="text-sm font-medium text-[#17181A]">
                  Payment Details
                </h2>
              </div>
            <span className="text-xs text-[#857F73]">
                {isCod ? "Cash on Delivery" : "Razorpay"}
              </span>
            </div>
            <dl className="mt-3 flex flex-col gap-2 text-sm">
             {!isCod && (
               <>
                  <div className="flex items-center justify-between">
                    <dt className="text-[#857F73]">Payment ID</dt>
                    <dd className="text-[#17181A]">{razorpayPaymentId}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-[#857F73]">Order ID (Razorpay)</dt>
                    <dd className="text-[#17181A]">{razorpayOrderId}</dd>
                  </div>
                </>
              )}
              <div className="flex items-center justify-between">
                <dt className="text-[#857F73]">Payment Status</dt>
                <dd>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClasses(postPaymentResponse?.paymentStatus ?? "pending")}`}
                  >
                    {paymentStatus === "paid"
                      ? "Paid"
                      : paymentStatus === "pending"
                        ? "Pending"
                        : "Failed"}
                  </span>
                </dd>
              </div>
              {!isCod && (
                <div className="flex items-center justify-between">
                  <dt className="text-[#857F73]">Paid On</dt>
                  <dd className="text-[#17181A]">{(paidAt && formatDate(paidAt)) || "Unknown"}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="rounded-lg border border-[#E3DFD8] bg-white p-6">
            <div className="flex items-center gap-2">
              <Headset className="h-4 w-4 text-[#17181A]" aria-hidden="true" />
              <h2 className="text-sm font-medium text-[#17181A]">
                Need Help?
              </h2>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[#857F73]">
              If you have any questions about your order, feel free to
              contact our support team.
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-flex h-9 items-center justify-center rounded-sm border border-[#E3DFD8] px-4 text-sm font-medium text-[#17181A] transition-colors duration-150 hover:bg-[#F0EDE7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/shop"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-sm bg-[#17181A] px-6 text-sm font-medium text-white transition-colors duration-150 hover:bg-[#454F45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
        >
          Continue Shopping
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <Link
          href="/orders"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-sm border border-[#E3DFD8] px-6 text-sm font-medium text-[#17181A] transition-colors duration-150 hover:bg-[#F0EDE7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
        >
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          View My Orders
        </Link>
      </div>
    </div>
  );
}
