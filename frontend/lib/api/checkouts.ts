
import { CheckoutStateApiResponse } from "@/types/types";
import { apiFetch } from "./client";

export async function getCheckoutState(endpoint: string = 'api/checkout/state'){
    return apiFetch<CheckoutStateApiResponse>('Checkout State', endpoint);
}