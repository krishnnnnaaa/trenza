"use client";

import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {AddToCartButton as CartButton} from '@/components/product-detail/AddToCartButton'
import { getPrimaryImage, type ProductWithImages } from "@/types/types";

// All new props are OPTIONAL -> shop page usage stays exactly as before.
interface ProductCardProps {
  product: ProductWithImages;
  isWishlisted?: boolean;
  onToggleWishlist?: () => void;
}

const priceFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

function WishlistButton({
  name,
  isWishlisted,
  onClick,
}: {
  name: string;
  isWishlisted: boolean;
  onClick?: () => void;
}) {
  const label = isWishlisted
    ? `Remove ${name} from wishlist`
    : `Add ${name} to wishlist`;

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={label}
      aria-pressed={isWishlisted}
      title={label}
      onClick={onClick}
      className="h-9 w-9 rounded-sm border-[#E3DFD8] bg-transparent text-[#17181A] hover:bg-[#F0EDE7] hover:text-[#454F45] focus-visible:ring-[#454F45]"
    >
      <Heart
        className={cn("h-4 w-4", isWishlisted && "fill-current")}
        aria-hidden="true"
      />
    </Button>
  );
}

export function ProductCard({
  product,
  isWishlisted = false,
  onToggleWishlist,
}: ProductCardProps) {
  const image = getPrimaryImage(product);
  const inStock = product.stock > 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-[#E3DFD8] bg-[#FAF8F5] transition-colors duration-200 hover:border-[#454F45]">
      <Link
        href={`/shop/${product.slug}`}
        className="relative block aspect-4/3 overflow-hidden bg-[#F0EDE7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
      >
        {image ? (
          <Image
            src={image.url}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain p-6 transition-transform duration-300 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-[#857F73]">
            No image available
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-col gap-1">
          <Link
            href={`/shop/${product.slug}`}
            className="line-clamp-1 text-base font-medium text-[#17181A] hover:text-[#454F45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
          >
            {product.name}
          </Link>
          <p className="line-clamp-2 text-sm text-[#857F73]">
            {product.description}
          </p>
        </div>

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

        <div className="mt-auto hidden flex-wrap xl:flex items-center justify-between gap-3 pt-1">
          <span className="text-lg font-semibold text-[#17181A]">
            {priceFormatter.format(product.price)}
          </span>

          <div className="flex items-center w-full gap-2">
            <WishlistButton
              name={product.name}
              isWishlisted={isWishlisted}
              onClick={onToggleWishlist}
            />

            <CartButton style={{height: 36}} productId={Number(product.id)}
          quantity={1}
          inStock={inStock}/>
          </div>
        </div>
        <div className="mt-auto w-full flex xl:hidden flex-col items-center justify-between gap-3 pt-1">
          <div className="flex w-full justify-between items-center gap-2">
            <span className="text-lg font-semibold text-[#17181A]">
              {priceFormatter.format(product.price)}
            </span>
            <WishlistButton
              name={product.name}
              isWishlisted={isWishlisted}
              onClick={onToggleWishlist}
            />
          </div>

          {/* <AddToCartButton
            name={product.name}
            inStock={inStock}
            loading={isAddingToCart}
            onClick={onAddToCart}
            className="w-full"
          /> */}
           <CartButton productId={Number(product.id)}
          quantity={1}
          inStock={inStock}/>
        </div>
      </div>
    </div>
  );
}