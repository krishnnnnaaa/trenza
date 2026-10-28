import { Plus, MapPin, ArrowRight } from "lucide-react";
import { fraunces } from "@/fonts/fonts";
import {
  AddressApiResponse,
  CheckoutStep,
} from "@/types/types";
import React, { useState } from "react";
import AddAddress from "./AddAddress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface AddressStepProps {
  onComplete: React.Dispatch<React.SetStateAction<CheckoutStep>>;
  onAddressCreated: (newAddress: AddressApiResponse) => void;
  address: AddressApiResponse[] | [];
  addressLoading?: boolean;
  setSelectedAddress: React.Dispatch<React.SetStateAction<AddressApiResponse | null>>;
}

const AddressStep = ({
  onComplete,
  address,
  onAddressCreated,
  setSelectedAddress,
  addressLoading = false,
}: AddressStepProps) => {
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const hasAddress =
    address && !(Array.isArray(address) && address.length === 0);

  const defaultAddress = address.find((addr) => addr.isDefault);
  const selectedAddress = address.find((addr) => addr.id === selectedAddressId);
  const effectiveSelectedAddress =
    selectedAddress ?? (!selectedAddressId ? defaultAddress : undefined);
  const effectiveSelectedAddressId = effectiveSelectedAddress?.id ?? null;

  return (
    <div className={`w-full lg:min-w-101.25 p-6 sm:p-7 ${fraunces.variable}`}>
      <h1
        className="text-3xl tracking-tight text-[#17181A] sm:text-4xl"
        style={{ fontFamily: "var(--font-fraunces)" }}
      >
        Delivery Address
      </h1>

      <p className="mt-2 text-sm leading-6 text-[#857F73]">
        Select a saved address or add a new one.
      </p>
      {addressLoading ? (
        <div className="mt-7 flex min-h-65 items-center justify-center rounded-2xl border border-[#E3DFD8] bg-[#FAF8F5]">
          <div className="flex flex-col items-center gap-3">
            <div
              className="h-6 w-6 animate-spin rounded-full border-2 border-[#E3DFD8] border-t-[#454F45]"
              aria-label="Loading addresses"
            />
            <p className="text-sm text-[#857F73]">
              Loading your saved addresses...
            </p>
          </div>
        </div>
      ) : !hasAddress ? (
        <div className="mt-7 rounded-2xl border border-[#E3DFD8] bg-[#FAF8F5] px-6 py-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F0EDE7]">
            <MapPin
              className="h-5 w-5 text-[#454F45]"
              strokeWidth={1.6}
              aria-hidden="true"
            />
          </div>

          <h2
            className="mt-5 text-2xl text-[#17181A]"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            No saved address
          </h2>

          <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#857F73]">
            Add a delivery address to continue with your order.
          </p>

          <AddAddress mode={"add"} onAddressCreated={onAddressCreated}>
            <button
              type="button"
              className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#332F2A] px-5 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#454F45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add New Address
            </button>
          </AddAddress>
        </div>
      ) : (
        <div className="mt-7">
          <RadioGroup
            value={effectiveSelectedAddressId?.toString() ?? ""}
            onValueChange={(value) => {
              const nextAddress = address.find(
                (addr) => addr.id === Number(value),
              );
              setSelectedAddressId(Number(value));
              setSelectedAddress(nextAddress ?? null);
            }}
            className=""
          >
            {address.map((addr) => (
              <div
                key={addr.id}
                className={`flex items-start hover:shadow-lg hover:cursor-pointer ${addr.isDefault ? "ring-2 ring-black/20" : ""} justify-between gap-3 border border-[#E3DFD8] bg-[#FAF8F5] mb-4 rounded-md px-6 py-4`}
              >
                <div className="flex items-start gap-1">
                  <RadioGroupItem
                    value={addr.id.toString()}
                    id={`address-${addr.id}`}
                    className="my-4"
                  />
                  <label
                    htmlFor={`address-${addr.id}`}
                    key={addr.id}
                    className="rounded-2xl px-6 py-4"
                  >
                    <p className="text-sm text-[#17181A]">{addr.fullName}</p>
                    <p className="text-sm text-[#17181A]">
                      {addr.addressLine1}, {addr.addressLine2}
                    </p>
                    <p className="text-sm text-[#17181A]">
                      {addr.city}, {addr.state} - {addr.postalCode}
                    </p>
                    <p className="text-sm text-[#17181A]">
                      Phone: {addr.phone}
                    </p>
                    {addr.isDefault && (
                      <span className="text-xs text-[#454F45]">
                        Default Address
                      </span>
                    )}
                  </label>
                </div>
                <AddAddress
                  mode={"edit"}
                  initialAddress={addr}
                  onAddressCreated={onAddressCreated}
                >
                  <button className="shrink-0 text-sm text-[#454F45] hover:underline hover:cursor-pointer">
                    Edit
                  </button>
                </AddAddress>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}
      <AddAddress mode={"add"} onAddressCreated={onAddressCreated}>
        <button
          type="button"
          className="mt-2 inline-flex w-full items-center justify-start h-16 gap-2 rounded-md border-dotted border-2 border-[#afaca5] bg-[#FAF8F5] px-5 text-sm font-medium text-black transition-colors duration-200 cursor-pointer hover:bg-[#f0edea] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add New Address
        </button>
      </AddAddress>
       <button
    onClick={() => {
      setSelectedAddress(effectiveSelectedAddress ?? null);
      onComplete("review");
    }}
    className="group mt-5 flex h-12 w-fit items-center justify-center gap-2 rounded-md justify-self-end bg-[#332F2A] px-5 text-sm font-medium text-white transition-all duration-200 hover:bg-[#454F45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
  >
    <span>Continue to Review</span>
    <ArrowRight
      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
      aria-hidden="true"
    />
  </button>
    </div>
  );
};

export default AddressStep;
