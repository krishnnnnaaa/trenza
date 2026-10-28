"use client";

import { useShop } from "@/app/context/ShopContent";
import { addProductToCart } from "@/lib/api/cart";
import { authClient } from "@/lib/auth-client";
import { Check, Loader2, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AddToCartButtonProps {
  productId: number;
  quantity: number;
  inStock: boolean;
  style?: React.CSSProperties;
  className?: string;
}

type AddToCartStatus = "idle" | "loading" | "success";

// Placeholder — swap this for a real cart mutation (API call / context
// dispatch) once cart integration exists. Kept here rather than inline
// in the component so the UI logic and the eventual API call stay
// separable.
async function addToCart(productId: number, quantity: number): Promise<void> {
  // await new Promise((resolve) => setTimeout(resolve, 700));
  await addProductToCart(productId, quantity);
}

export function AddToCartButton({
  productId,
  quantity,
  inStock,
  style,
  className
}: AddToCartButtonProps) {
  const [status, setStatus] = useState<AddToCartStatus>("idle");
  const {fetchCartCount} = useShop()
  const router = useRouter();
  const {data: session, isPending} = authClient.useSession()
  const isAuthenticated = !!session?.user;

  async function handleClick() {
    if (isPending) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (status === "loading") return;
    setStatus("loading");
    try {
      await addToCart(productId, quantity)
        await fetchCartCount?.();
      setStatus("success");
      setTimeout(() => setStatus("idle"), 1800);
    } catch {
      setStatus("idle");
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!inStock || status === "loading" || isPending}
      style={style}
      className={`flex h-12 flex-1 px-2 py-2.5 w-full items-center justify-center gap-2 rounded-sm bg-[#17181A] text-sm font-medium text-white transition-colors duration-150 hover:bg-[#454F45] disabled:pointer-events-none disabled:opacity-40 ${className || ""}`}
    >
      {status === "loading" && (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Adding&hellip;
        </>
      )}
      {status === "success" && (
        <>
          <Check className="h-4 w-4" aria-hidden="true" />
          Added to Cart
        </>
      )}
      {status === "idle" && (
        <>
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          {inStock ? "Add to Cart" : "Out of Stock"}
        </>
      )}
    </button>
  );
}
