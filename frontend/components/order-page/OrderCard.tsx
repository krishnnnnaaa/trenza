import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { OrderItemsPreview } from "./Orderitemspreview";
import { OrderStatusBadge } from "./Orderstatusbadge";
import { Order } from "@/types/types";
import { formatINR, formatOrderDate } from "@/lib/utils";

export function OrderCard({ order }: { order: Order }) {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <article className="rounded-xl border bg-card text-card-foreground">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b p-4 sm:p-5">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold sm:text-lg">Order #{order.id}</h2>
          <p className="text-sm text-muted-foreground">Placed on {formatOrderDate(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </header>

      <div className="p-4 sm:p-5">
        <OrderItemsPreview items={order.items} />
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t p-4 sm:p-5">
        <div>
          <p className="text-sm text-muted-foreground">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
          <p className="text-lg font-semibold">{formatINR(order.totalAmount)}</p>
        </div>
        <Link href={`/orders/${order.id}`} className={buttonVariants({ variant: "outline" })}>
          View Order
        </Link>
      </footer>
    </article>
  );
}