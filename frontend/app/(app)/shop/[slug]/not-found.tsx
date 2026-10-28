import type { Metadata } from "next";

import { ProductNotFound } from "@/components/product/ProductNotFound";

export const metadata: Metadata = {
  title: "Product not found — Trenza",
};

/**
 * Next.js renders this automatically when notFound() is called inside
 * app/products/[slug]/page.tsx (e.g. after a failed product lookup),
 * or when a request hits a /products/* route that doesn't match.
 */
export default function ProductNotFoundPage() {
  return <ProductNotFound />;
}
