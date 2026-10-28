"use client";
import { ProductWithImages } from "@/types/types";
import React from "react";
import { ProductNotFound } from "../product/ProductNotFound";
import { ProductCard } from "../HomePage/Product/Product";
import { useWishlist } from "@/lib/UseWishlist";

interface CategoryProductsProps {
  title: string;
  products: ProductWithImages[];
  excludeProductId?: string;
}

const CategoryProducts = ({
  title,
  excludeProductId,
  products,
}: CategoryProductsProps) => {
  const { toggle, isWishlisted } = useWishlist();

  let data = excludeProductId
    ? products.filter(
        (product) => Number(product.id) !== Number(excludeProductId),
      )
    : products;

  if (data.length === 0) {
    return (
      <ProductNotFound
        title="No related products"
        description="We couldn't find other products in this category right now."
      />
    );
  }

  data = data.length > 7 ? data.slice(0, 4) : data;

  return (
    <section aria-labelledby="category-products-heading" className="mt-16">
      <h2
        id="category-products-heading"
        className="font-serif text-2xl font-normal text-[#17181A] sm:text-3xl"
      >
        {title}
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {data &&
          data.map((product) => (
            <ProductCard
              isWishlisted={isWishlisted(Number(product.id))}
              onToggleWishlist={() => toggle(Number(product.id))}
              key={product.id}
              product={product}
            />
          ))}
      </div>
    </section>
  );
};

export default CategoryProducts;
