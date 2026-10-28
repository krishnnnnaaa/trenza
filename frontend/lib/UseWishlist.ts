"use client";

import { useCallback, useEffect, useState } from "react";

import { addWishlistItem, deleteWishlistItem, getWishlist } from "@/lib/api/wishlist";
import { authClient } from "./auth-client";
import { useRouter } from "next/navigation";
import { useShop } from "@/app/context/ShopContent";

const EMPTY_ITEM_IDS: ReadonlyMap<number, number> = new Map();

/**
 * Shop / product-detail side wishlist state.
 * Call ONCE at list level (not inside each card) -> one fetch per page.
 * Keeps a productId -> wishlistItemId map (delete API needs the wishlist item id).
 */
export function useWishlist() {
  const [itemIds, setItemIds] = useState<ReadonlyMap<number, number>>(new Map());
  const [pending, setPending] = useState<ReadonlySet<number>>(new Set());
  const [ready, setReady] = useState(false);
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null);
  const router = useRouter();
  const {fetchWishlistCount} = useShop()
  const {data: session, isPending} = authClient.useSession()

  const isAuthenticated = !!session?.user;
  useEffect(() => {
    let cancelled = false;
    if(isPending) return;
    if(!isAuthenticated){
      return;
    }

    getWishlist()
      .then((res) => {
        if (cancelled) return;

        if (!res?.data || !Array.isArray(res.data.items)) {
          setItemIds(EMPTY_ITEM_IDS);
          return;
        }

        setItemIds(new Map(res.data.items.map((i) => [Number(i.product.id), i.id])));
      })
       .catch((error) => {
      if (!cancelled) {
        console.error("Failed to fetch wishlist:", error);
        setItemIds(EMPTY_ITEM_IDS);
      }
    })
      .finally(() => {
       if(!cancelled) {
         setLoadedUserId(session?.user.id ?? null);
         setReady(true);
       }
      });
    return () => {
      cancelled = true;
    };
  }, [isPending, isAuthenticated, session?.user.id]);

  const setBusy = (productId: number, busy: boolean) =>
    setPending((prev) => {
      const next = new Set(prev);
      if (busy) next.add(productId);
      else next.delete(productId);
      return next;
    });

  const toggle = useCallback(
    async (productId: number) => {
      if(isPending) return;
      if(!isAuthenticated) {
        router.push("/login");
        return;
      };
      if(!ready) return;
      if (pending.has(productId)) return; // block double clicks
      setBusy(productId, true);
      try {
        const existingId = itemIds.get(productId);
        if (existingId !== undefined) {
          const res = await deleteWishlistItem(existingId);
          if (res) {
            setItemIds((prev) => {
              const next = new Map(prev);
              next.delete(productId);
              return next;
            });
            await fetchWishlistCount?.()
          }
        } else {
          const res = await addWishlistItem(productId);
          if (res) {
            setItemIds((prev) => new Map(prev).set(productId, res.data.id));
            await fetchWishlistCount?.()
          }
        }
      }
      finally {
        setBusy(productId, false);
      }
    },
    [itemIds, pending, ready, isPending, isAuthenticated, router, fetchWishlistCount],
  );

  const userId = session?.user.id ?? null;
  const isReadyForCurrentUser =
    !isAuthenticated || (ready && loadedUserId === userId);
  const visibleItemIds =
    isAuthenticated && isReadyForCurrentUser ? itemIds : EMPTY_ITEM_IDS;

  return {
    isWishlisted: (productId: number) => visibleItemIds.has(productId),
    isPending: (productId: number) => pending.has(productId),
    toggle,
    ready: isReadyForCurrentUser,
  };
}