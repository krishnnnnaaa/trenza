"use client"
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { ProductCard } from "@/components/HomePage/Product/Product";
import type { ProductSection, ProductWithImages } from "@/types/types";
import { useWishlist } from "@/lib/UseWishlist";
import { useEffect, useState } from "react";
import { getFeaturesProducts, getNewArrivals } from "@/lib/api/products";
import { CategoryProductsSkeleton } from "@/components/product-detail/CategoryProductsSkeleton";

export function ProductSection({subtitle, title, id}:ProductSection) {
  const {isWishlisted, toggle} = useWishlist()
  const [products, setproducts] = useState<ProductWithImages[] | null>(null)

  useEffect(() => {
    
    async function fetchProducts(id: "newest" | "featured"){

      if(id === 'newest'){
        const res = await getNewArrivals();
        if(res){
          setproducts(res);
        }
      }
      else if(id === 'featured'){
        const res = await getFeaturesProducts();
        if(res){
          setproducts(res);
        }
      }
    }

    fetchProducts(id);
  }, [id])

  
  
  return (
    <section id={id}
      aria-labelledby="new-arrivals-heading"
      className="bg-[#FAF8F5] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-10 text-center sm:mb-12">
          <h2
            id="new-arrivals-heading"
            className="font-serif text-3xl font-normal text-[#17181A] sm:text-4xl"
          >
           {title}
          </h2>
          <p className="mt-3 text-sm text-[#857F73] sm:text-base">
           {subtitle}
          </p>
        </div>

          {
            products === null && <CategoryProductsSkeleton/>
          }
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          { products && products.map((product) => (
            <ProductCard isWishlisted={isWishlisted(Number(product.id))} onToggleWishlist={()=> toggle(Number(product.id))} key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 flex justify-end sm:mt-12">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#17181A] transition-colors duration-150 hover:text-[#454F45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
          >
            View All
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}