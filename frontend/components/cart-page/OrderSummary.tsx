"use client";

import Link from "next/link";
import {
  ArrowRight,
  LockKeyhole,
  Package,
  Truck,
} from "lucide-react";

import { CartItemResponse } from "@/types/types";

interface OrderSummaryProps {
  items: CartItemResponse[];
}

const OrderSummary = ({
  items
}: OrderSummaryProps) => {
  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  const shipping = subtotal > 49 ? 0 : 19;

  const total = subtotal + shipping;

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);



  return (
    <div className="w-full lg:min-w-101.25 rounded-2xl border border-[#E3DFD8] bg-[#FAF8F5] p-6 shadow-[0_4px_20px_rgba(23,24,26,0.03)] sm:p-7">
      {/* Heading */}
      <h2
        className="text-[26px] leading-tight text-[#17181A]"
        style={{ fontFamily: "var(--font-fraunces)" }}
      >
        Order Summary
      </h2>

      {/* Price breakdown */}
      <div className="mt-7 space-y-4">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-[#4E4B46]">
            Subtotal ({items.length} items)
          </span>

          <span className="font-medium text-[#17181A]">
            {formatPrice(subtotal)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-[#4E4B46]">Shipping</span>

          <span className="font-medium text-[#17181A]">
            {shipping === 0 ? "Free" : formatPrice(shipping)}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="my-5 border-t border-[#E3DFD8]" />

      {/* Total */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className="text-xl text-[#17181A]"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Total
          </p>

          <p className="mt-1 text-xs text-[#857F73]">
            Shipping calculated at checkout.
          </p>
        </div>

        <span className="text-xl font-semibold tracking-tight text-[#17181A]">
          {formatPrice(total)}
        </span>
      </div>

      {/* Checkout */}
    {items.length === 0 ? (
  <div
    aria-disabled="true"
    className="mt-5 flex h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-[#D8D5CF] px-5 text-sm font-medium text-[#8A867F]"
  >
    <span>Proceed to Checkout</span>
    <ArrowRight className="h-4 w-4" aria-hidden="true" />
  </div>
) : (
  <Link
    href="/checkout"
    className="group mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#332F2A] px-5 text-sm font-medium text-white transition-all duration-200 hover:bg-[#454F45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
  >
    <span>Proceed to Checkout</span>
    <ArrowRight
      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
      aria-hidden="true"
    />
  </Link>
)}

      {/* Free shipping highlight */}
      {
        shipping === 0 && (
          <div className="mt-4 flex items-center gap-4 rounded-xl bg-[#EEF3E9] px-4 py-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F7F9F4]">
          <Truck
            className="h-5 w-5 text-[#3D7A43]"
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium text-[#34713A]">
            Free shipping
          </p>

          <p className="mt-0.5 text-xs leading-5 text-[#5F685D]">
            You&apos;re eligible for free shipping on this order!
          </p>
        </div>
      </div>
        ) 
      }

      {/* Trust information */}
      <div className="mt-5 space-y-4">
        {/* Secure checkout */}
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F3F0EB]">
            <LockKeyhole
              className="h-5 w-5 text-[#302E2A]"
              strokeWidth={1.7}
              aria-hidden="true"
            />
          </div>

          <div>
            <p className="text-sm font-medium text-[#252421]">
              Secure Checkout
            </p>

            <p className="mt-0.5 text-xs text-[#857F73]">
              Your data is handled securely.
            </p>
          </div>
        </div>

        {/* Easy returns */}
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F3F0EB]">
            <Package
              className="h-5 w-5 text-[#302E2A]"
              strokeWidth={1.7}
              aria-hidden="true"
            />
          </div>

          <div>
            <p className="text-sm font-medium text-[#252421]">
              Easy Returns
            </p>

            <p className="mt-0.5 text-xs text-[#857F73]">
              Simple returns on eligible products.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;