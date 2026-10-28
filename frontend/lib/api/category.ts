import { CategoryApiResponse, ProductWithImages } from "@/types/types";
import { apiFetch } from "./client";

export async function getCategories(endpoint: string = 'api/categories'){
    return apiFetch<Promise<CategoryApiResponse>>('Category', endpoint);
}


export async function getProductsByCategory(slug: string){
    return apiFetch<Promise<ProductWithImages[]>>("Category Products", `api/categories/${slug}/products`)
}