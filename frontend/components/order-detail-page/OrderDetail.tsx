"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { getOrderById } from "@/lib/api/order"; // adjust path to your helper file
import { OrderStatusBadge } from "../order-page/Orderstatusbadge";
import { formatOrderDate } from "@/lib/utils";
import { OrderDetailsSkeleton } from "./Orderdetailsskeleton";
import { OrderItems } from "./OrderItem";
import { OrderSummary } from "./OrderSummary";
import { PaymentInfoCard } from "./PaymentInfo";
import { ShippingAddressCard } from "./ShippingAddress";
import type { OrderDetail } from "@/types/types";
import OrderDetailsError from "./OrderDetailsError";

type Status = "loading" | "error" | "ready";

export default function OrderDetailsPage() {
  const params = useParams<{ orderId: string }>();
  const orderId = Number(params.orderId);
  const isValidId = Number.isInteger(orderId) && orderId > 0;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!isValidId) return;
    let cancelled = false;

    getOrderById(orderId)
      .then((data) => {
        if (cancelled) return;
        if (!data) return setStatus("error"); // helper returns undefined on failure
        setOrder(data);
        setStatus("ready");
      })
      .catch(() => !cancelled && setStatus("error"));

    return () => {
      cancelled = true;
    };
  }, [orderId, isValidId, attempt]);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12">
      <Link
        href="/orders"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        My Orders
      </Link>

      {!isValidId ? (
        <OrderDetailsError
          title="Order not found"
          description="This order link doesn't look right. Head back to your orders and try again."
        />
      ) : (
        <>
          <header className="mb-6 flex flex-wrap items-start justify-between gap-3 sm:mb-8">
            <div className="min-w-0">
              <h1 className="break-all text-2xl font-semibold tracking-tight sm:text-3xl">
                Order #{orderId}
              </h1>
              {order && status === "ready" && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Placed on {formatOrderDate(order.createdAt)}
                </p>
              )}
            </div>
            {order && status === "ready" && <OrderStatusBadge status={order.status} />}
          </header>

          {status === "loading" && <OrderDetailsSkeleton />}
          {status === "error" && (
            <OrderDetailsError
              onRetry={() => {
                setStatus("loading");
                setAttempt((n) => n + 1);
              }}
            />
          )}
          {status === "ready" && order && (
            <div className="grid items-start gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <OrderItems items={order.items} />
              </div>
              <aside className="space-y-4">
                <OrderSummary items={order.items} totalAmount={order.totalAmount} />
                <ShippingAddressCard address={order.address} />
                <PaymentInfoCard payment={order.payment!} />
              </aside>
            </div>
          )}
        </>
      )}
    </main>
  );
}