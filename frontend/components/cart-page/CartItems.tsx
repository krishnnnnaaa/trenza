import { Trash2 } from "lucide-react";

import { CART_GRID_COLS, CartItem } from "./CartItem";
import { CartItemResponse } from "@/types/types";
import { colors } from "@/lib/constants/colors";

interface CartItemsProps {
  items: CartItemResponse[];
  onQuantityChange: (itemId: number, quantity: number) => void;
  onRemove: (itemId: number) => void;
  onClearCart: () => void;
}

export function CartItems({
  items,
  onQuantityChange,
  onRemove,
  onClearCart,
}: CartItemsProps) {
  


  return (
    <div className="flex flex-col bg-white p-4 rounded-md mt-4" style={{border: colors.border.subtle, borderStyle: "solid", borderWidth: "0.2px"}}>
      {/* Column headers — desktop/tablet only; mobile rows label themselves */}
      <div
        className={`hidden border-b border-[#E3DFD8] pb-3 mb-4 text-sm text-[#857F73] sm:grid sm:gap-6 ${CART_GRID_COLS}`}
      >
        <span>Product</span>
        <span className="text-right">Price</span>
        <span className="text-center">Quantity</span>
        <span className="text-right">Total</span>
        <span aria-hidden="true" />
      </div>

      <div>
        {items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onQuantityChange={onQuantityChange}
            onRemove={onRemove}
          />
        ))}
      </div>

      <div className="flex justify-end border-t border-[#E3DFD8] pt-6">
        <button
          type="button"
          onClick={onClearCart}
          className="inline-flex items-center gap-2 text-sm text-[#857F73] transition-colors duration-150 hover:text-[#A64B45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Clear Cart
        </button>
      </div>
    </div>
  );
}