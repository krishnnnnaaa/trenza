import { AddressApiResponse, addressFormType } from "@/types/types";
import { ApiError, apiFetch } from "./client";
import { toast } from "@/components/ui/toast";

export async function getAddress() {
  try {
    const response = await apiFetch<{data: AddressApiResponse[]}>("Get Addresss", "api/address", {
      credentials: "include"
    });
    if (!response) {
      toast.add({
        type: "error",
        description: "Failed to get saved addresses.",
      });
    }
    return response;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return { data: [] as AddressApiResponse[] }; // no addresses yet = empty, not an error
    }
    if (error instanceof ApiError) {
      toast.add({
        type: "error",
        title: "Error",
        description: error.message,
      });
    } else {
      toast.add({
        type: "error",
        description: "Something went wrong",
      });
    }
  }
}

export async function addToAddress(address: addressFormType) {
  try {
    const response = await apiFetch<{data: AddressApiResponse}>("Add Addresss", "api/address", {
      credentials: "include",
      method: "POST",
      body: JSON.stringify(address)
    });
    if (!response) {
      toast.add({
        type: "error",
        description: "Failed to add address.",
      });
    }
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      toast.add({
        type: "error",
        title: "Error",
        description: error.message,
      });
    } else {
      toast.add({
        type: "error",
        description: "Something went wrong",
      });
    }
  }
}

export async function UpdateAddress(address: addressFormType, addressId: number) {
  try {
    const response = await apiFetch<{data: AddressApiResponse}>("Update Addresss", `api/address/${addressId}`, {
      credentials: "include",
      method: "PATCH",
      body: JSON.stringify(address)
    });
    if (!response) {
      toast.add({
        type: "error",
        description: "Failed to update address.",
      });
    }
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      toast.add({
        type: "error",
        title: "Error",
        description: error.message,
      });
    } else {
      toast.add({
        type: "error",
        description: "Something went wrong",
      });
    }
  }
}

export async function deleteAddress(addressId: number) {
  try {
    return await apiFetch<{ message: string }>("Delete Address", `api/address/${addressId}`, {
      credentials: "include",
      method: "DELETE",
    });
  } catch (error) {
    if (error instanceof ApiError) {
      toast.add({
        type: "error",
        title: "Error",
        description: error.message,
      });
    } else {
      toast.add({
        type: "error",
        description: "Something went wrong",
      });
    }
  }
}