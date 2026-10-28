"use client";

import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { AddToCartButton as CartButton } from "@/components/product-detail/AddToCartButton";
import { cn } from "@/lib/utils";
import { getPrimaryImage, type ProductWithImages } from "@/types/types";

interface ProductListItemProps {
  product: ProductWithImages;
  isWishlisted?: boolean;
  onToggleWishlist?: () => void;
}

const priceFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

export function ProductListItem({
  product,
  isWishlisted = false,
  onToggleWishlist,
}: ProductListItemProps) {
  const image = getPrimaryImage(product);
  const inStock = product.stock > 0;

  return (
    <div className="group flex gap-4 rounded-lg border border-[#E3DFD8] bg-[#FAF8F5] p-3 transition-colors duration-200 hover:border-[#454F45] sm:gap-6 sm:p-4">
      <Link
        href={`/shop/${product.slug}`}
        className="relative block h-24 w-24 shrink-0 overflow-hidden rounded-md bg-[#F0EDE7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2 sm:h-32 sm:w-32"
      >
        {image ? (
          <Image
            src={image.url}
            alt={product.name}
            fill
            sizes="128px"
            className="object-contain p-3 transition-transform duration-300 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-[#857F73]">
            No image
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between gap-2 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex flex-col gap-1">
          <Link
            href={`/shop/${product.slug}`}
            className="line-clamp-1 text-base font-medium text-[#17181A] hover:text-[#454F45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
          >
            {product.name}
          </Link>
          <p className="line-clamp-2 max-w-md text-sm text-[#857F73] sm:line-clamp-1">
            {product.description}
          </p>
          <p
            className="text-xs"
            aria-label={inStock ? "In stock" : "Out of stock"}
          >
            {inStock ? (
              <span className="text-[#454F45]">In Stock</span>
            ) : (
              <span className="text-[#857F73]">Out of Stock</span>
            )}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 w-full sm:flex-col sm:items-end sm:justify-center sm:gap-3">
          <div className="flex items-start xl:w-fit w-full xl:items-center xl:flex-row flex-col gap-2">
            <div className="flex gap-2 items-center">
          <span className="text-lg font-semibold text-[#17181A]">
            {priceFormatter.format(product.price)}
          </span>
            <Button
              variant="outline"
              size="icon"
              aria-label={
                isWishlisted
                  ? `Remove ${product.name} from wishlist`
                  : `Add ${product.name} to wishlist`
                }
                aria-pressed={isWishlisted}
                title={
                isWishlisted
                  ? `Remove ${product.name} from wishlist`
                  : `Add ${product.name} to wishlist`
              }
              onClick={onToggleWishlist}
              className="h-9 w-9 rounded-sm border-[#E3DFD8] bg-transparent text-[#17181A] hover:bg-[#F0EDE7] hover:text-[#454F45] focus-visible:ring-[#454F45]"
              >
              <Heart
                className={cn("h-4 w-4", isWishlisted && "fill-current")}
                aria-hidden="true"
                />
            </Button>
                </div>

            <CartButton
            className="xl:w-fit w-full"
              style={{ height: 36, padding: 10 }}
              productId={Number(product.id)}
              quantity={1}
              inStock={inStock}
            />
          </div>
        </div>
      </div>
    </div>
  );
}