import { ProductDetailResponse, ProductWithImages } from "@/types/types";
import React, { Suspense } from "react";
import { Breadcrumbs } from "./BreadCrumbs";
import { ProductGallery } from "./ProductGallery";
import { ProductInfo } from "./ProductInfo";
import { ProductDescription } from "./ProductDescription";
import CategoryProducts from "./CategoryProducts";
import { CategoryProductsSkeleton } from "./CategoryProductsSkeleton";
import { getProductsByCategory } from "@/lib/api/category";

interface ProductDetailProps {
  data: ProductDetailResponse;
}
export async function ProductDetail({ data }: ProductDetailProps) {
  const {
    id,
    images,
    name,
    categoryName,
    categorySlug,
  } = data;

  const breadCrumbItem = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    ...(categoryName
      ? [{ label: categoryName, href: `/shop?category=${categorySlug}` }]
      : []),
    { label: name },
  ];

  // Fetch related products in the same category
  const products = Object.values(await getCategoryProducts(categorySlug));
  async function getCategoryProducts(categorySlug: string): Promise<ProductWithImages[]> {
    const response = await getProductsByCategory(categorySlug);
    return response ?? [];
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-14">
      <Breadcrumbs items={breadCrumbItem} />

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={images} productName={name} />
        <ProductInfo data={data} />
      </div>

      <ProductDescription data={data} />
      <Suspense fallback={<CategoryProductsSkeleton />}>
        <CategoryProducts
          products={products}
          excludeProductId={id}
          title="You May Also Like"
        />
      </Suspense>
    </div>
  );
}
