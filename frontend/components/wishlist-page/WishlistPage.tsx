"use client";

import { useEffect, useState } from "react";

import { toast } from "@/components/ui/toast";
import { deleteWishlistItem, getWishlist } from "@/lib/api/wishlist";
import { ProductCard } from "@/components/HomePage/Product/Product"; // adjust path
import OrderDetailsError  from "../order-detail-page/OrderDetailsError"; // generic error UI (title/description/onRetry)
import type { ProductWithImages, WishlistItem } from "@/types/types";
import { EmptyWishlist } from "./EmptyWishlist";
import { WishlistSkeleton } from "./WishlistSkeleton";
import { ApiError } from "@/lib/api/client";
import { useShop } from "@/app/context/ShopContent";

type Status = "loading" | "error" | "ready";

// WishlistItem = { product, images } -> shape ProductCard already expects
const toCardProduct = (item: WishlistItem): ProductWithImages => ({
  ...item.product,
  images: item.images,
});

export default function WishlistPageComponent() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [attempt, setAttempt] = useState(0);
  const { fetchWishlistCount } = useShop();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);



useEffect(() => {
  let cancelled = false;

  getWishlist()
    .then((res) => {
      if (cancelled) return;
      if (!res?.data || !Array.isArray(res.data.items)) {
        setErrorMessage("Unexpected response from server");
        return setStatus("error");
      }
      setItems(res.data.items);
      setStatus("ready");
    })
    .catch((error: unknown) => {
      if (cancelled) return;
      setErrorMessage(
        error instanceof ApiError ? error.message : "Something went wrong",
      );
      setStatus("error");
    });

  return () => {
    cancelled = true;
  };
}, [attempt]);

  // Optimistic remove, rollback to original position if the request fails
  const handleRemove = async (item: WishlistItem) => {
    const index = items.findIndex((i) => i.id === item.id);
    if (index === -1) return;
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    const res = await deleteWishlistItem(item.id);
    if (!res) {
      setItems((prev) => {
        if (prev.some((i) => i.id === item.id)) return prev;
        const next = [...prev];
        next.splice(Math.min(index, next.length), 0, item);
        return next;
      });
      return;
    }
    fetchWishlistCount?.();
    toast.add({ type: "success", description: "Removed from wishlist" });
    };

    return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:py-12">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-[#17181A] sm:text-3xl">
          Wishlist
        </h1>
        <p className="mt-1 text-sm text-[#857F73]">
          Save your favorite products and come back to them anytime.
        </p>
        {status === "ready" && items.length > 0 && (
          <p className="mt-3 text-sm font-medium text-[#454F45]">
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>
        )}
      </header>

      {status === "loading" && <WishlistSkeleton />}
      {status === "error" && (
        <OrderDetailsError
          title="We couldn't load your wishlist"
          description={errorMessage ?? "Something went wrong"}
          onRetry={() => {
            setStatus("loading");
            setErrorMessage(null);
            setAttempt((n) => n + 1);
          }}
        />
      )}
      {status === "ready" &&
        (items.length === 0 ? (
          <EmptyWishlist />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
              <ProductCard
                key={item.id}
                product={toCardProduct(item)}
                isWishlisted
                onToggleWishlist={() => handleRemove(item)}

              />
            ))}
          </div>
        ))}
    </main>
  );
}