"use client";

import React, { useState } from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "cn";
import { AddressApiResponse, addressFormType } from "@/types/types";
import { addToAddress, UpdateAddress } from "@/lib/api/address";
import { toast } from "../../ui/toast";
import { Spinner } from "../../ui/spinner";

// Props for the AddAddress component
interface AddAddressProps {
  mode: "add" | "edit"; // Mode can be either "add" or "edit"
  children: React.ReactElement;
  onAddressCreated?: (newAddress: AddressApiResponse) => void; // Optional callback for when an address is created
  initialAddress?: AddressApiResponse; // Optional initial address data
}

// List of Indian states
const STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const inputClassName =
  "h-11 rounded-md border-[#E3DFD8] bg-[#FCFBF9] text-sm text-[#332F2A] placeholder:text-[#A39D92] focus-visible:border-[#454F45] focus-visible:ring-[#454F45]/20";

const AddAddress = ({
  children,
  onAddressCreated,
  initialAddress,
  mode,
}: AddAddressProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDefault, setIsDefault] = useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (nextOpen) {
      setIsDefault(initialAddress?.isDefault ?? false);
    }
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const address: addressFormType = {
      fullName: String(formData.get("fullName") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      addressLine1: String(formData.get("addressLine1") ?? ""),
      addressLine2: String(formData.get("addressLine2") ?? ""),
      city: String(formData.get("city") ?? ""),
      state: String(formData.get("state") ?? ""),
      postalCode: String(formData.get("postalCode") ?? ""),
      isDefault: formData.get("isDefault") === "on",
      country: "India", // Default country set to India
    };

    if (mode === "edit" && initialAddress?.id) {
      // If in edit mode, call the API to update the address
      const reSubmitForm = await UpdateAddress(address, initialAddress.id);
      if (reSubmitForm?.data.id) {
        onAddressCreated?.(reSubmitForm.data); // Call the callback if provided
        toast.add({
          type: "success",
          description: "Address updated successfully.",
        });
      } else {
        console.error("Failed to update address.");
      }
      setOpen(false);
      setLoading(false);
    } else {
      // If in add mode, call the API to add the address
      const submitForm = await addToAddress(address);
      if (submitForm?.data.id) {
        onAddressCreated?.(submitForm.data); // Call the callback if provided
        toast.add({
          type: "success",
          description: "Address added successfully.",
        });
      } else {
        console.error("Failed to add address.");
      }
      setOpen(false);
      setLoading(false);
    }
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Trigger render={children} />
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-[#17181A]/40 backdrop-blur-sm data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <DialogPrimitive.Popup className="fixed top-1/2 left-1/2 z-50 flex max-h-[min(92vh,800px)] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto rounded-md border border-[#E3DFD8] bg-[#FCFBF9] p-0 text-[#332F2A] shadow-2xl outline-none data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
          <div className="border-b border-[#EDE9E2] px-6 py-3 sm:px-6">
            <DialogPrimitive.Title
              className="font-normal text-2xl tracking-tight text-[#17181A]"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              {mode === "edit" ? "Edit Address" : "Add New Address"}
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="mt-1 text-sm leading-6 text-[#857F73]">
              Add a delivery address for your order.
            </DialogPrimitive.Description>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-3 px-6 py-4 sm:px-8 sm:py-6"
          >
            <div className="space-y-0">
              <label
                htmlFor="address-full-name"
                className="text-sm font-medium"
              >
                Full Name
              </label>
              <input
                id="address-full-name"
                name="fullName"
                required
                defaultValue={initialAddress?.fullName || ""}
                placeholder="Rohit Sharma"
                className={cn(
                  "w-full border px-3 outline-none",
                  inputClassName,
                )}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="address-phone" className="text-sm font-medium">
                Phone Number
              </label>
              <input
                id="address-phone"
                name="phone"
                type="tel"
                defaultValue={initialAddress?.phone || ""}
                required
                placeholder="+91 98765 43210"
                className={cn(
                  "w-full border px-3 outline-none",
                  inputClassName,
                )}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="address-line-1" className="text-sm font-medium">
                Address Line 1
              </label>
              <input
                id="address-line-1"
                name="addressLine1"
                required
                defaultValue={initialAddress?.addressLine1 || ""}
                placeholder="123, Green Park, Near City Mall"
                className={cn(
                  "w-full border px-3 outline-none",
                  inputClassName,
                )}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="address-line-2" className="text-sm font-medium">
                Address Line 2{" "}
                <span className="text-[#A39D92]">(Optional)</span>
              </label>
              <input
                defaultValue={initialAddress?.addressLine2 || ""}
                id="address-line-2"
                name="addressLine2"
                placeholder="Flat 4B, Sunrise Apartments"
                className={cn(
                  "w-full border px-3 outline-none",
                  inputClassName,
                )}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div className="space-y-2">
                <label htmlFor="address-city" className="text-sm font-medium">
                  City
                </label>
                <input
                  id="address-city"
                  name="city"
                  defaultValue={initialAddress?.city || ""}
                  required
                  type="text"
                  placeholder="Bangalore"
                  className={cn(
                    "w-full border px-3 outline-none",
                    inputClassName,
                  )}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="address-state" className="text-sm font-medium">
                  State
                </label>
                <select
                  id="address-state"
                  name="state"
                  required
                  defaultValue={initialAddress?.state || ""}
                  className={cn(
                    "w-full appearance-none border px-3 outline-none",
                    inputClassName,
                  )}
                >
                  <option value="" disabled>
                    Select state
                  </option>
                  {STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="address-postal-code"
                  className="text-sm font-medium"
                >
                  PIN Code
                </label>
                <input
                  id="address-postal-code"
                  name="postalCode"
                  required
                  inputMode="numeric"
                  defaultValue={initialAddress?.postalCode || ""}
                  placeholder="560001"
                  className={cn(
                    "w-full border px-3 outline-none",
                    inputClassName,
                  )}
                />
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-[#514B43]">
              <Checkbox
                name="isDefault"
                checked={isDefault}
                onCheckedChange={(checked) => setIsDefault(checked === true)}
              />
              Set as default address
            </label>

            <div className="flex flex-col-reverse gap-3 border-t border-[#EDE9E2] pt-5 sm:flex-row">
              <DialogPrimitive.Close
                render={
                  <button
                    type="button"
                    className="xl:py-0 py-2.5 h-11 flex-1 rounded-xl border border-[#E3DFD8] bg-transparent px-5 text-sm font-medium text-[#514B43] transition-colors hover:bg-[#F0EDE7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45]/30"
                  />
                }
              >
                Cancel
              </DialogPrimitive.Close>
              <button
                type="submit"
                className="xl:py-0 py-2.5 h-11 flex-1 rounded-xl bg-[#454F45] px-5 text-sm font-medium text-white transition-colors hover:bg-[#332F2A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45]/40 focus-visible:ring-offset-2 justify-center flex items-center gap-2"
                disabled={loading}
              >
                {loading && <Spinner className="h-4 w-4" />}
                {mode === "edit" ? "Update Address" : "Add Address"}
              </button>
            </div>
          </form>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default AddAddress;
