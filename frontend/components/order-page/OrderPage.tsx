
"use client";

import { useEffect, useState } from "react";
import { getOrders } from "@/lib/api/order";
import { EmptyOrders } from "./EmptyOrders";
import { OrderCard } from "./OrderCard";
import { OrdersError } from "./Orderserror";
import { OrdersSkeleton } from "./Ordersskeleton";
import { Order } from "@/types/types";

type Status = "loading" | "error" | "ready";

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const PAGE_SIZE = 10;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [attempt, setAttempt] = useState(0);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchOrders() {
      setStatus("loading");

      try {
        const res = await getOrders(page, PAGE_SIZE);

        if (cancelled) return;

        if (!res || !Array.isArray(res.data) || !res.pagination) {
          setStatus("error");
          return;
        }

        setOrders(res.data);
        setPagination({
          ...res.pagination,
          total: Number(res.pagination.total),
        });
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    fetchOrders();

    return () => {
      cancelled = true;
    };
  }, [page, attempt]);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:py-12">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          My Orders
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track and manage your recent purchases.
        </p>
      </header>

      {status === "loading" && <OrdersSkeleton />}

      {status === "error" && (
        <OrdersError onRetry={() => setAttempt((n) => n + 1)} />
      )}

      {status === "ready" && (
        <>
          {orders.length === 0 ? (
            <EmptyOrders />
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}

          {pagination.totalPages > 1 && (
            <nav
              className="mt-8 flex items-center justify-between gap-4"
              aria-label="Orders pagination"
            >
              <p className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
                {" · "}
                {pagination.total} orders
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-md border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setPage((p) =>
                      Math.min(pagination.totalPages, p + 1)
                    )
                  }
                  disabled={page >= pagination.totalPages}
                  className="rounded-md border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </nav>
          )}
        </>
      )}
    </main>
  );
}
