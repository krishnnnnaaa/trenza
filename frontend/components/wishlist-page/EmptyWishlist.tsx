import { Heart } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EmptyWishlist() {
  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed border-[#E3DFD8] bg-[#FAF8F5] px-6 py-16 text-center">
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-[#F0EDE7]">
        <Heart className="size-7 text-[#857F73]" aria-hidden="true" />
      </div>
      <h2 className="text-lg font-semibold text-[#17181A]">
        No saved items yet
      </h2>
      <p className="mt-1 max-w-sm text-sm text-[#857F73]">
        Save products you love and they&apos;ll appear here.
      </p>
      <Link
        href="/shop"
        className={cn(
          buttonVariants(),
          "mt-6 rounded-sm bg-[#17181A] text-white hover:bg-[#454F45]",
        )}
      >
        Continue Shopping
      </Link>
    </div>
  );
}