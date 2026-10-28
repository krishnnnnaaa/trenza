"use client";

import { CheckCircle2, Pencil, Trash2 } from "lucide-react";

import AddAddress from "@/components/checkout-page/address/AddAddress"; // TODO: adjust to your AddAddress path
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import type { AddressApiResponse } from "@/types/types";

interface AddressCardProps {
  address: AddressApiResponse;
  isSettingDefault: boolean;
  onSaved: (address: AddressApiResponse) => void;
  onSetDefault: (address: AddressApiResponse) => void;
  onDelete: (address: AddressApiResponse) => void;
}

const actionClass =
  "inline-flex h-9 items-center gap-1.5 rounded-sm border border-[#E3DFD8] bg-transparent px-3 text-sm font-medium text-[#17181A] transition-colors duration-150 hover:bg-[#F0EDE7] hover:text-[#454F45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60";

export function AddressCard({
  address,
  isSettingDefault,
  onSaved,
  onSetDefault,
  onDelete,
}: AddressCardProps) {
  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-md border bg-[#FAF8F5] p-5 transition-colors duration-200",
        address.isDefault ? "border-[#454F45]" : "border-[#E3DFD8] hover:border-[#454F45]/60",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 wrap-break-word text-base font-medium text-[#17181A]">
          {address.fullName}
        </h3>
        {address.isDefault && (
          <span className="shrink-0 rounded-full bg-[#454F45]/10 px-2.5 py-0.5 text-xs font-medium text-[#454F45]">
            Default
          </span>
        )}
      </div>

      <address className="space-y-0.5 wrap-break-word text-sm not-italic text-[#514B43]">
        <p>{address.addressLine1}</p>
        {address.addressLine2 && <p>{address.addressLine2}</p>}
        <p>
          {address.city}, {address.state} {address.postalCode}
        </p>
        <p>{address.country}</p>
        <p className="pt-1 text-[#857F73]">Phone: {address.phone}</p>
      </address>

      <div className="mt-auto flex flex-wrap gap-2 border-t border-[#E3DFD8] pt-4">
        <AddAddress mode="edit" initialAddress={address} onAddressCreated={onSaved}>
          <button type="button" className={actionClass}>
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
            Edit
          </button>
        </AddAddress>

        {!address.isDefault && (
          <button
            type="button"
            onClick={() => onSetDefault(address)}
            disabled={isSettingDefault}
            aria-busy={isSettingDefault}
            className={actionClass}
          >
            {isSettingDefault ? (
              <Spinner className="h-3.5 w-3.5" />
            ) : (
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            Set as Default
          </button>
        )}

        <button
          type="button"
          onClick={() => onDelete(address)}
          aria-label={`Delete address for ${address.fullName}`}
          className={cn(actionClass, "ml-auto text-destructive hover:text-destructive")}
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          Delete
        </button>
      </div>
    </article>
  );
}