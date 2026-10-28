"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  WishlistButton,
} from "@/components/product-detail/WishlistButton";
import { AddToCartButton } from "@/components/product-detail/AddToCartButton";
import { cn } from "@/lib/utils";
import { getPrimaryImage, type ProductWithImages } from "@/types/types";
import { OutOfStockBadge } from "./TrendingProduct";
import { formatPrice } from "@/lib/format-price";

interface TrendingFeaturedProps {
  product: ProductWithImages | null;
  isWishlisted?: boolean;
  onToggleWishlist?: () => void;
  onAddToCart?: () => void;
  isAddingToCart?: boolean;
}

export function TrendingFeatured({
  product,
}: TrendingFeaturedProps) {
  const [activeImageId, setActiveImageId] = useState<
    ProductWithImages["images"][number]["id"] | null
  >(() => (product ? getPrimaryImage(product)?.id ?? null : null));

  const inStock = product ? product.stock > 0 : false;
  const href = product ? `/shop/${product.slug}` : "#";
  const gallery = product?.images.slice(0, 4) ?? [];
  const activeImage = product
    ? gallery.find((image) => image.id === activeImageId) ?? getPrimaryImage(product)
    : undefined;

  if (!product) {
    return null;
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#E3DFD8] bg-white md:flex-row xl:flex-col">
      {/* Gallery */}
      <div className="p-3 md:w-1/2 md:shrink-0 xl:w-full">
        <Link
          href={href}
          aria-label={product.name}
          className="relative block aspect-square overflow-hidden rounded-lg bg-[#F0EDE7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
        >
          {activeImage ? (
            <Image
              src={activeImage.url}
              alt={product.name}
              fill
              sizes="(min-width: 1280px) 28vw, (min-width: 768px) 40vw, 90vw"
              className={cn(
                "object-contain p-8 transition-transform duration-500 ease-out group-hover:scale-105",
                !inStock && "opacity-60",
              )}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-[#857F73]">
              No image available
            </div>
          )}
          {!inStock && <OutOfStockBadge />}
        </Link>

        {gallery.length > 1 && (
          <ul className="mt-3 flex gap-2" aria-label="Product images">
            {gallery.map((image, index) => {
              const selected = image.id === activeImage?.id;
              return (
                <li key={image.id}>
                  <button
                    type="button"
                    onClick={() => setActiveImageId(image.id)}
                    aria-label={`Show image ${index + 1} of ${gallery.length}`}
                    aria-pressed={selected}
                    className={cn(
                      "relative size-12 overflow-hidden rounded-md border bg-[#F0EDE7] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2",
                      selected ? "border-[#454F45]" : "border-[#E3DFD8] hover:border-[#857F73]",
                    )}
                  >
                    <Image
                      src={image.url}
                      alt=""
                      fill
                      sizes="48px"
                      className="object-contain p-1"
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-3 p-5 pt-2 md:justify-center md:p-8 xl:justify-start xl:p-5 xl:pt-2">
        <Link
          href={href}
          className="line-clamp-2 font-serif text-2xl font-normal leading-snug text-[#17181A] transition-colors hover:text-[#454F45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
        >
          {product.name}
        </Link>

        <p className="line-clamp-3 text-sm leading-6 text-[#857F73]">
          {product.description}
        </p>

        <div className="flex items-center justify-between gap-3">
          <span className="text-xl font-semibold text-[#17181A]">
            {formatPrice(String(product.price))}
          </span>
          <span
            className={cn("text-xs", inStock ? "text-[#454F45]" : "text-[#857F73]")}
          >
            {inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        <div className="mt-auto flex items-center gap-2 pt-2 md:mt-4 xl:mt-auto">
          <WishlistButton
            productId={Number(product.id)}
            key={product.id}
            productName={product.name}
          />
          <AddToCartButton
            productId={Number(product.id)}
            inStock={inStock}
            quantity={1}
            key={`product.id-${product.id}`}
            style={{height: "36px", flex: "1"}}
          />
        </div>
      </div>
    </article>
  );
}