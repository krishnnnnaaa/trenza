"use client"
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import type { ProductWithImages } from "@/types/types";

import { TrendingFeatured } from "./TrendingFeatured";
import { TrendingProductCard } from "./TrendingProduct";
import { useEffect, useState } from "react";
import { getTrendyProducts } from "@/lib/api/products";

// ---- dummy data (replace with real data) -------------------------------
// const products: ProductWithImages[] = [
//   {
//     id: "prod_1",
//     name: "Wool Overcoat",
//     categoryId: "cat_outerwear",
//     slug: "wool-overcoat",
//     description:
//       "A tailored wool overcoat with a clean silhouette, cut for layering through colder months.",
//     price: 289,
//     stock: 12,
//     createdAt: "2026-08-01T00:00:00.000Z",
//     updatedAt: "2026-08-01T00:00:00.000Z",
//     images: [
//       { id: "img_1", productId: "prod_1", url: "/images/wool-overcoat.webp", isPrimary: true, createdAt: "2026-08-01T00:00:00.000Z" },
//     ],
//   },
//   {
//     id: "prod_2",
//     name: "Silk Slip Dress",
//     categoryId: "cat_dresses",
//     slug: "silk-slip-dress",
//     description:
//       "A bias-cut silk slip dress with a soft drape, finished with a hand-rolled hem.",
//     price: 165,
//     stock: 0,
//     createdAt: "2026-08-03T00:00:00.000Z",
//     updatedAt: "2026-08-03T00:00:00.000Z",
//     images: [
//       { id: "img_2", productId: "prod_2", url: "/images/silk-slip-dress.webp", isPrimary: true, createdAt: "2026-08-03T00:00:00.000Z" },
//     ],
//   },
//   {
//     id: "prod_3",
//     name: "Leather Chelsea Boots",
//     categoryId: "cat_footwear",
//     slug: "leather-chelsea-boots",
//     description:
//       "Hand-finished leather Chelsea boots with an elastic side panel and stacked heel.",
//     price: 210,
//     stock: 6,
//     createdAt: "2026-08-05T00:00:00.000Z",
//     updatedAt: "2026-08-05T00:00:00.000Z",
//     images: [
//       { id: "img_3", productId: "prod_3", url: "/images/leather-chelsea-boots.webp", isPrimary: true, createdAt: "2026-08-05T00:00:00.000Z" },
//     ],
//   },
//   {
//     id: "prod_4",
//     name: "Cashmere Scarf",
//     categoryId: "cat_accessories",
//     slug: "cashmere-scarf",
//     description:
//       "A generously sized cashmere scarf, soft-brushed for warmth without added bulk.",
//     price: 95,
//     stock: 24,
//     createdAt: "2026-08-07T00:00:00.000Z",
//     updatedAt: "2026-08-07T00:00:00.000Z",
//     images: [
//       { id: "img_4", productId: "prod_4", url: "/images/cashmere-scarf.webp", isPrimary: true, createdAt: "2026-08-07T00:00:00.000Z" },
//     ],
//   },
// ];

// ------------------------------------------------------------------------

function ProductGrid({ items }: { items: ProductWithImages[] }) {
  return (
    <div className="grid min-w-0 xl:self-center grid-cols-2 gap-4">
      {items && items.map((product, index) => (
        <TrendingProductCard key={`trendy_${product.id}-${index}`} product={product} />
      ))}
    </div>
  );
}

export function TrendingSection() {
  const [products, setproducts] = useState<ProductWithImages[] | null>(null)
  
useEffect(() => {
   async function fetchProducts(){
       const res = await getTrendyProducts();
       if(res){
         setproducts(res);
       }
   }

   fetchProducts();
 }, [])

const featured = products && products[4];
const leftProducts = products && products.slice(0, 4);
const rightProducts = products && products.slice(5, 9);

  return (
    <section id="trending"
      aria-labelledby="trending-heading"
      className="bg-[#FAF8F5] py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="mx-auto mb-10 max-w-xl text-center sm:mb-14">
          <h2
            id="trending-heading"
            className="font-serif text-3xl font-normal text-[#17181A] sm:text-4xl"
          >
            Trending Now
          </h2>
          <p className="mt-3 text-sm text-[#857F73] sm:text-base">
            Shop by trends, chosen by millions
          </p>
        </div>

        {/* Below xl: featured on top, 2-col (mobile) / 4-col (tablet) grid */}
        <div className="space-y-6 sm:space-y-8 xl:hidden">
          <div className="mx-auto max-w-md md:max-w-3xl">
            <TrendingFeatured  product={featured!} />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {products && products.map((product) => (
              <TrendingProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* xl+: products | featured | products, equal height */}
        <div className="hidden xl:grid xl:grid-cols-[1fr_1.15fr_1fr] xl:items-stretch xl:gap-6">
          <ProductGrid items={leftProducts!} />
          <TrendingFeatured product={featured!} />
          <ProductGrid items={rightProducts!} />
        </div>

        <div className="mt-10 text-center sm:mt-12">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#17181A] underline-offset-4 transition-colors hover:text-[#454F45] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
          >
            View all products
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}