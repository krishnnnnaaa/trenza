import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

const SHOP_HREF = "/shop"; // TODO: set to your actual shop route

export function EmptyOrders() {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed px-6 py-16 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-muted">
        <ShoppingBag className="size-6 text-muted-foreground" aria-hidden />
      </div>
      <h2 className="text-lg font-semibold">No orders yet</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Your purchases will appear here once you place your first order.
      </p>
      <Link href={SHOP_HREF} className={`${buttonVariants()} mt-6`}>
        Start Shopping
      </Link>
    </div>
  );
}