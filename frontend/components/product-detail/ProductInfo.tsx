"use client";

import { useState } from "react";

import { AddToCartButton } from "@/components/product-detail/AddToCartButton";
import { QuantitySelector } from "@/components/product-detail/QuantitySelector";
import { WishlistButton } from "@/components/product-detail/WishlistButton";
import { formatPrice } from "@/lib/format-price"
import type { ProductDetailResponse } from "@/types/types";
import Link from "next/link";

interface ProductInfoProps {
  data: ProductDetailResponse
}


export function ProductInfo({ data }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const inStock = data.stock > 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        {data.brand && (
          <span className="text-sm text-[#857F73]">{data.brand}</span>
        )}
        <h1 className="font-serif text-3xl font-normal text-[#17181A] sm:text-4xl">
          {data.name}
        </h1>
        <span className="text-2xl font-semibold text-[#17181A]">
          {formatPrice(String(data.price))}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span
          className="text-sm"
          aria-label={inStock ? "In stock" : "Out of stock"}
        >
          {inStock ? (
            <span className="text-[#454F45]">In Stock</span>
          ) : (
            <span className="text-[#857F73]">Out of Stock</span>
          )}
        </span>

        {data.categoryName && (
          <>
            <span className="text-[#E3DFD8]" aria-hidden="true">
              &middot;
            </span>
            <Link
              href={`/shop?category=${data.categorySlug}`}
              className="text-sm text-[#857F73] underline-offset-4 transition-colors duration-150 hover:text-[#454F45] hover:underline"
            >
              {data.categoryName}
            </Link>
          </>
        )}
      </div>

      {data.tags && data.tags.length > 0 && (
        <ul className="flex flex-wrap gap-2" role="list" aria-label="Tags">
          {data.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-[#E3DFD8] px-3 py-1 text-xs text-[#857F73]"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-col gap-3 border-t border-[#E3DFD8] pt-5">
        <span className="text-sm font-medium text-[#17181A]">Quantity</span>
        <QuantitySelector
          quantity={quantity}
          onQuantityChange={setQuantity}
          max={data.stock}
          disabled={!inStock}
        />
      </div>

      <div className="flex items-center gap-3">
        <AddToCartButton
          productId={Number(data.id)}
          quantity={quantity}
          inStock={inStock}
        />
        <WishlistButton productId={Number(data.id)} productName={data.name} />
      </div>
    </div>
  );
}
