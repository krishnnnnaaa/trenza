import Image from "next/image";
import { Package } from "lucide-react";
import { OrderItem } from "@/types/types";

const MAX_VISIBLE = 3;
const TILE = "relative size-16 shrink-0 overflow-hidden rounded-md border bg-muted sm:size-20";

export function OrderItemsPreview({ items }: { items: OrderItem[] }) {
  if (items.length === 0) return null;

  const visible = items.slice(0, MAX_VISIBLE);
  const extra = items.length - visible.length;

  return (
    <ul className="flex items-center gap-2" aria-label="Products in this order">
      {visible.map((item) => (
        <li key={item.id} className={TILE}>
          {item.productImage ? (
            <Image
              src={item.productImage}
              alt={item.productName}
              fill
              sizes="80px"
              unoptimized
              className="object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-muted-foreground">
              <Package className="size-5" aria-label={item.productName} />
            </div>
          )}
        </li>
      ))}
      {extra > 0 && (
        <li className={`${TILE} flex items-center justify-center text-center text-xs font-medium leading-tight text-muted-foreground`}>
          +{extra} more
        </li>
      )}
    </ul>
  );
}