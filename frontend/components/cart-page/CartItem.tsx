"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { formatPrice } from "@/lib/format-price";
import { CartItemResponse, getPrimaryImage } from "@/types/types";

// Kept identical between CartItem and CartItems' header row so columns
// line up: Product | Price | Quantity | Total | Remove.
export const CART_GRID_COLS =
  "sm:grid-cols-[minmax(0,1fr)_96px_136px_96px_40px]";

interface CartItemProps {
  item: CartItemResponse;
  onQuantityChange: (itemId: number, quantity: number) => void;
  onRemove: (itemId: number) => void;
}

export function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
  const { product, images, quantity } = item;
  const productWithImageObj = {
    ...product,
    images
  }
  const image = getPrimaryImage(productWithImageObj);
  const inStock = product.stock > 0;

  const unitPrice = Number.parseFloat(product.price as unknown as string);
  const lineTotal = Number.isNaN(unitPrice)
    ? null
    : (unitPrice * quantity).toFixed(2);

  function handleDecrease() {
    if (quantity <= 1) return;
    onQuantityChange(item.id, quantity - 1);
  }

  function handleIncrease() {
    if (quantity >= product.stock) return;
    onQuantityChange(item.id, quantity + 1);
  }

  return (
    <div
      className={`grid grid-cols-1 gap-4 border-b border-[#E3DFD8] py-6 first:pt-0 last:border-b-0 sm:items-center sm:gap-6 ${CART_GRID_COLS}`}
    >
      {/* Product: image + info */}
      <div className="flex gap-4">
        <Link
          href={`/shop/${product.slug}`}
          className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-[#F0EDE7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
        >
          {image ? (
            <Image
              src={image.url}
              alt={product.name}
              fill
              sizes="80px"
              className="object-contain p-2"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-[#857F73]">
              No image
            </div>
          )}
        </Link>

        <div className="flex flex-col gap-1">
          {product.brand && (
            <span className="text-xs text-[#857F73]">{product.brand}</span>
          )}
          <Link
            href={`/shop/${product.slug}`}
            className="text-sm font-medium text-[#17181A] transition-colors duration-150 hover:text-[#454F45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
          >
            {product.name}
          </Link>
          <span
            className="text-xs"
            aria-label={inStock ? "In stock" : "Out of stock"}
          >
            {inStock ? (
              <span className="text-[#454F45]">In Stock</span>
            ) : (
              <span className="text-[#857F73]">Out of Stock</span>
            )}
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center justify-between text-sm font-medium text-[#17181A] sm:justify-end">
        <span className="text-xs text-[#857F73] sm:hidden">Price</span>
        {formatPrice(String(product.price))}
      </div>

      {/* Quantity */}
      <div className="flex items-center justify-between sm:justify-center">
        <span className="text-xs text-[#857F73] sm:hidden">Quantity</span>
        <div
          className="inline-flex items-center rounded-sm border border-[#E3DFD8]"
          role="group"
          aria-label={`Quantity for ${product.name}`}
        >
          <button
            type="button"
            onClick={handleDecrease}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="flex h-9 w-9 items-center justify-center text-[#17181A] transition-colors duration-150 hover:bg-[#F0EDE7] disabled:pointer-events-none disabled:opacity-40"
          >
            <Minus className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <span
            className="flex h-9 w-9 items-center justify-center text-sm font-medium text-[#17181A]"
            aria-live="polite"
          >
            {quantity}
          </span>
          <button
            type="button"
            onClick={handleIncrease}
            disabled={quantity >= product.stock}
            aria-label="Increase quantity"
            className="flex h-9 w-9 items-center justify-center text-[#17181A] transition-colors duration-150 hover:bg-[#F0EDE7] disabled:pointer-events-none disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between text-sm font-semibold text-[#17181A] sm:justify-end">
        <span className="text-xs font-normal text-[#857F73] sm:hidden">
          Total
        </span>
        {lineTotal !== null ? formatPrice(lineTotal) : "—"}
      </div>

      {/* Remove */}
      <div className="flex justify-end sm:justify-center">
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${product.name} from cart`}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm text-[#857F73] transition-colors duration-150 hover:bg-[#F0EDE7] hover:text-[#A64B45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}