import type { Metadata } from "next";

import { ProductNotFound } from "@/components/product/ProductNotFound";

export const metadata: Metadata = {
  title: "Product not found — Trenza",
};


export default function ProductPageNotFound() {
  return <ProductNotFound />;
}
