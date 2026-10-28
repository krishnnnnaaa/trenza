"use client";

import Image from "next/image";
import Link from "next/link";

import { WishlistButton } from "@/components/product-detail/WishlistButton"; // add `export` to WishlistButton there
import { cn } from "@/lib/utils";
import { getPrimaryImage, type ProductWithImages } from "@/types/types";
import { formatPrice } from "@/lib/format-price";

// Wishlist props are optional -> wire them from the section when real data is in.
interface TrendingProductCardProps {
  product: ProductWithImages;
  isWishlisted?: boolean;
  onToggleWishlist?: () => void;
}


export function OutOfStockBadge() {
  return (
    <span className="absolute left-2 top-2 rounded-full bg-[#857F73] px-2.5 py-0.5 text-[11px] font-medium text-white">
      Out of Stock
    </span>
  );
}

export function TrendingProductCard({
  product,
}: TrendingProductCardProps) {
  const image = getPrimaryImage(product);
  const inStock = product.stock > 0;
  const href = `/shop/${product.slug}`;

  return (
    <article className="group flex h-full flex-col rounded-lg border border-[#E3DFD8] bg-white p-3 transition-colors duration-200 hover:border-[#454F45]">
      <Link
        href={href}
        aria-label={product.name}
        className="relative block aspect-square overflow-hidden rounded-md bg-[#F0EDE7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
      >
        {image ? (
          <Image
            src={image.url}
            alt={product.name}
            fill
            sizes="(min-width: 1280px) 12vw, (min-width: 768px) 22vw, 45vw"
            className={cn(
              "object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-105",
              !inStock && "opacity-60",
            )}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-[#857F73]">
            No image available
          </div>
        )}
        {!inStock && <OutOfStockBadge />}
      </Link>

      <div className="mt-3 flex flex-1 flex-col gap-2">
        <Link
          href={href}
          className="line-clamp-1 text-sm font-medium text-[#17181A] transition-colors hover:text-[#454F45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
        >
          {product.name}
        </Link>

        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="text-base font-semibold text-[#17181A]">
            {formatPrice(String(product.price))}
          </span>
          <WishlistButton
          productId={Number(product.id)}
          productName={product.name}
          key={product.id}
          />
        </div>
      </div>
    </article>
  );
}