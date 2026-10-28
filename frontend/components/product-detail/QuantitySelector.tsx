"use client";

import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  max: number;
  disabled?: boolean;
}

export function QuantitySelector({
  quantity,
  onQuantityChange,
  max,
  disabled = false,
}: QuantitySelectorProps) {
  return (
    <div
      className="inline-flex items-center rounded-sm border border-[#E3DFD8]"
      role="group"
      aria-label="Quantity"
    >
      <button
        type="button"
        onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
        disabled={disabled || quantity <= 1}
        aria-label="Decrease quantity"
        className="flex h-10 w-10 items-center justify-center text-[#17181A] transition-colors duration-150 hover:bg-[#F0EDE7] disabled:pointer-events-none disabled:opacity-40"
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>

      <span
        className="flex h-10 w-10 items-center justify-center text-sm font-medium text-[#17181A]"
        aria-live="polite"
      >
        {quantity}
      </span>

      <button
        type="button"
        onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
        disabled={disabled || quantity >= max}
        aria-label="Increase quantity"
        className="flex h-10 w-10 items-center justify-center text-[#17181A] transition-colors duration-150 hover:bg-[#F0EDE7] disabled:pointer-events-none disabled:opacity-40"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
