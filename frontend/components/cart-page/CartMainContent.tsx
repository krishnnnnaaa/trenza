"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { Breadcrumbs } from "../product-detail/BreadCrumbs";
import { CartItems } from "./CartItems";
import { Spinner } from "@/components/ui/spinner";
import OrderSummary from "./OrderSummary";

import { CartResponse } from "@/types/types";
import {
  ClearCart,
  getCart,
  RemoveCartItem,
  updateCartItemQuantity,
} from "@/lib/api/cart";

import { toast } from "../ui/toast";
import { useShop } from "@/app/context/ShopContent";

const CartMainContent = () => {
  const [loading, setLoading] = useState(true);
  const {fetchCartCount} = useShop()
  const [cart, setCart] = useState<CartResponse | null>(null);

  const breadCrumbItem = [
    { label: "Home", href: "/" },
    { label: "Cart", href: "/cart" },
  ];

  const fetchCart = async () => {
    try {
      const response = await getCart();
      setCart(response as CartResponse);
    } catch (error) {
      if (error instanceof Error) {
        toast.add({
          type: "error",
          description: error.message,
        });
      } else {
        toast.add({
          type: "error",
          description: "Failed to fetch cart.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadCart = async () => {
      await fetchCart();
    };

    void loadCart();
  }, []);

  const items = cart?.data.items ?? [];

  const itemCount = items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  async function handleQuantityChange(
    itemId: number,
    quantity: number,
  ) {
    try {
      await updateCartItemQuantity(quantity, itemId);
      await fetchCart();
      fetchCartCount?.();
    } catch (error) {
      if (error instanceof Error) {
        toast.add({
          type: "error",
          description: error.message,
        });
      } else {
        toast.add({
          type: "error",
          description: "Failed to update quantity.",
        });
      }
    }
  }

  async function handleRemoveCartItem(itemId: number) {
    try {
      await RemoveCartItem(itemId);
      await fetchCart();
      fetchCartCount?.();
    } catch (error) {
      if (error instanceof Error) {
        toast.add({
          type: "error",
          description: error.message,
        });
      } else {
        toast.add({
          type: "error",
          description: "Failed to remove cart item.",
        });
      }
    }
  }

  async function handleRemoveCart() {
    try {
      await ClearCart();
      await fetchCart();
      fetchCartCount?.();
    } catch (error) {
      if (error instanceof Error) {
        toast.add({
          type: "error",
          description: error.message,
        });
      } else {
        toast.add({
          type: "error",
          description: "Failed to clear cart.",
        });
      }
    }
  }

  return (
    <div>
      <Breadcrumbs items={breadCrumbItem} />

      <header className="max-w-2xl">
        <h1
          className="mt-3 text-4xl leading-tight tracking-tight text-[#17181A] sm:text-5xl lg:text-4xl"
          style={{ fontFamily: "var(--font-fraunces)" }}
        >
          Shopping Cart
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-6 text-[#857F73] sm:text-base sm:leading-7">
          {loading
            ? "Loading your cart..."
            : `You have ${itemCount} ${
                itemCount === 1 ? "item" : "items"
              } in your cart`}
        </p>
      </header>

      {loading ? (
        <div className="mt-4 flex min-h-100 items-center justify-center rounded-2xl border border-[#E3DFD8] bg-white">
          <Spinner className="size-6 text-[#454F45]" />
        </div>
      ) : items.length === 0 ? (
        <div className="mt-4 flex flex-col items-center bg-white px-6 py-24 text-center sm:py-32">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F0EDE7]">
            <ShoppingBag
              className="h-6 w-6 text-[#454F45]"
              aria-hidden="true"
              strokeWidth={1.75}
            />
          </span>

          <h2 className="mt-6 font-serif text-2xl font-normal text-[#17181A] sm:text-3xl">
            Your cart is empty
          </h2>

          <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#857F73]">
            Browse the collection and add something you love.
          </p>

          <Link
            href="/shop"
            className="mt-8 inline-flex h-11 items-center justify-center rounded-sm bg-[#17181A] px-6 text-sm font-medium text-white transition-colors duration-150 hover:bg-[#454F45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
          >
            Browse all products
          </Link>
        </div>
      ) : (
        <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <section className="min-w-0">
            <CartItems
              items={items}
              onClearCart={handleRemoveCart}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemoveCartItem}
            />
          </section>

          <aside className="lg:sticky lg:top-24">
            <OrderSummary items={items} />
          </aside>
        </div>
      )}
    </div>
  );
};

export default CartMainContent;