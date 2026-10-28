import { ProductDetail } from '@/components/product-detail/ProductDetail'
import { getProductBySlug } from '@/lib/api/products'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

interface ProductPageProps {
  params: Promise<{slug: string}>
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProductBySlug(slug);
 
  if (!data) {
    // return { title: "Product not found — Trenza" };
    notFound();
  }
 
  return {
    title: `${data.name} — Trenza`,
    description: data.description ?? undefined,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
   const {slug} = await params;
    async function getData(){
        const fetchdata = await getProductBySlug(slug);
        return fetchdata;
    }

    const data = await getData()

    if(!data){
      notFound()
    }
  return (
    <ProductDetail data={data}/>
  )
}