import { ProductApiResponse, ProductDetailResponse } from "@/types/types";
import { apiFetch, ApiError } from "./client";

export async function getProduct(endpoint: string){
    return apiFetch<Promise<ProductApiResponse>>('Product', endpoint);
}

export async function getProductBySlug(slug:string){
    try {
        const response = await apiFetch<{data: ProductDetailResponse}>(
            'Product Detail',
            `api/products/${slug}`,
            {next: {revalidate: 60}},
        );
        return response.data;
    } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
            return null;
        }
        throw error;
    }
}

export async function getNewArrivals(){
    const response = apiFetch<{data: ProductDetailResponse[]}>('New Arrivals', `api/products?sort=newest`, {next: {revalidate: 60}})

    if(!response){
        return null;
    }
    return (await response).data.slice(0, 4);
}

export async function getFeaturesProducts(){
    const products = [505, 373, 516, 428];
    const response = apiFetch<{data: ProductDetailResponse[]}>('Featured Products', `api/products/selected`, {
        method: 'POST',
        body: JSON.stringify({ productIds: products }),
        next: {revalidate: 60}}
    );

    if(!response){
        return null;
    }   

    return (await response).data;
}


export async function getTrendyProducts(){
    const products = [414, 337, 330, 407, 425, 449, 363, 505, 477];
    const response = apiFetch<{data: ProductDetailResponse[]}>('Trendy Products', `api/products/selected`, {
        method: 'POST',
        body: JSON.stringify({ productIds: products }),
        next: {revalidate: 60}}
    );

    if(!response){
        return null;
    }   

    return (await response).data;
}
