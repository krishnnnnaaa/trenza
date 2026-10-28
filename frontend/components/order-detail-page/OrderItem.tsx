import Image from "next/image";
import { Package } from "lucide-react";
import { formatINR } from  "@/lib/utils";
import {lineTotal}  from "@/lib/money";
import type {OrderItem}  from "@/types/types";
import Link from "next/link";

function OrderItem({ item }: { item: OrderItem }) {
  
  return (
    <li className="flex gap-3 py-4 first:pt-0 last:pb-0 sm:gap-4">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-md border bg-muted sm:size-24">
        {item.productImage ? (
          <Image
            src={item.productImage}
            alt={item.productName}
            fill
            sizes="96px"
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <Package className="size-6" aria-label={item.productName} />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2 sm:flex-row sm:items-start">
        <div className="min-w-0">
          <Link target="_blank" href={`/shop/${item.productSlug}`} className="line-clamp-2 wrap-break-word font-medium">{item.productName}</Link>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatINR(item.price)} × {item.quantity}
          </p>
        </div>
        <p className="font-semibold sm:text-right">{formatINR(lineTotal(item.price, item.quantity))}</p>
      </div>
    </li>
  );
}

export function OrderItems({ items }: { items: OrderItem[] }) {
  return (
    <section className="rounded-xl border bg-card p-4 text-card-foreground sm:p-5">
      <h2 className="mb-4 text-base font-semibold">
        Items ({items.reduce((sum, i) => sum + i.quantity, 0)})
      </h2>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No items found for this order.</p>
      ) : (
        <ul className="divide-y">
          {items.map((item) => (
            <OrderItem key={item.id} item={item} />
          ))}
        </ul>
      )}
    </section>
  );
}