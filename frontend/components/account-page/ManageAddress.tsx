"use client";

import { MapPin, Plus } from "lucide-react";
import { useEffect, useState } from "react";

import AddAddress from "@/components/checkout-page/address/AddAddress";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { deleteAddress, getAddress, UpdateAddress } from "@/lib/api/address";
import type { AddressApiResponse, addressFormType } from "@/types/types";
import OrderDetailsError from "../order-detail-page/OrderDetailsError"; // generic error UI (title/description/onRetry)
import { AddressCard } from "./AddressCard";
import { DeleteAddressDialog } from "./DeleteAddressDialog";

type Status = "loading" | "error" | "ready";

const addButtonClass =
  "inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#332F2A] px-5 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#454F45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2";

// PATCH expects the full form shape (same as your edit dialog sends)
const toFormValues = (a: AddressApiResponse, isDefault: boolean): addressFormType => ({
  fullName: a.fullName,
  phone: a.phone,
  addressLine1: a.addressLine1,
  addressLine2: a.addressLine2,
  city: a.city,
  state: a.state,
  postalCode: a.postalCode,
  country: a.country,
  isDefault,
});

function AddressesSkeleton() {
  return (
    <div role="status" aria-label="Loading addresses" className="grid gap-4 lg:grid-cols-2">
      {[0, 1].map((i) => (
        <div key={i} className="space-y-3 rounded-md border border-[#E3DFD8] bg-[#FAF8F5] p-5">
          <Skeleton className="h-5 w-1/2 bg-[#F0EDE7]" />
          <Skeleton className="h-4 w-full bg-[#F0EDE7]" />
          <Skeleton className="h-4 w-2/3 bg-[#F0EDE7]" />
          <Skeleton className="h-4 w-1/3 bg-[#F0EDE7]" />
          <div className="flex gap-2 border-t border-[#E3DFD8] pt-4">
            <Skeleton className="h-9 w-20 rounded-sm bg-[#F0EDE7]" />
            <Skeleton className="h-9 w-32 rounded-sm bg-[#F0EDE7]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ManageAddresses() {
  const [items, setItems] = useState<AddressApiResponse[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [attempt, setAttempt] = useState(0);
  const [defaultPending, setDefaultPending] = useState<ReadonlySet<number>>(new Set());
  const [addressToDelete, setAddressToDelete] = useState<AddressApiResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getAddress()
      .then((res) => {
        if (cancelled) return;
        // helper already toasts and returns undefined on failure
        if (!res || !Array.isArray(res.data)) return setStatus("error");
        setItems(res.data);
        setStatus("ready");
      })
      .catch(() => !cancelled && setStatus("error"));

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  // Used by AddAddress for BOTH add and edit
  const handleSaved = (saved: AddressApiResponse) => {
    setItems((prev) => {
      const exists = prev.some((a) => a.id === saved.id);
      const next = exists ? prev.map((a) => (a.id === saved.id ? saved : a)) : [...prev, saved];
      // only one default at a time
      return saved.isDefault ? next.map((a) => (a.id === saved.id ? a : { ...a, isDefault: false })) : next;
    });
  };

  const handleSetDefault = async (address: AddressApiResponse) => {
    if (defaultPending.has(address.id)) return;
    setDefaultPending((prev) => new Set(prev).add(address.id));
    try {
      const res = await UpdateAddress(toFormValues(address, true), address.id);
      if (res?.data) {
        handleSaved({ ...res.data, isDefault: true });
        toast.add({ type: "success", description: "Default address updated." });
      }
    } finally {
      setDefaultPending((prev) => {
        const next = new Set(prev);
        next.delete(address.id);
        return next;
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!addressToDelete || isDeleting) return;
    setIsDeleting(true);
    try {
      const res = await deleteAddress(addressToDelete.id);
      if (res) {
        setItems((prev) => prev.filter((a) => a.id !== addressToDelete.id));
        toast.add({ type: "success", description: "Address deleted." });
        setAddressToDelete(null);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // default address first
  const sorted = [...items].sort((a, b) => Number(b.isDefault) - Number(a.isDefault));

  return (
    <section>
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-[#17181A]">Manage Address</h2>
          <p className="mt-1 text-sm text-[#857F73]">
            Add, edit or remove the delivery addresses saved to your account.
          </p>
        </div>
        {status === "ready" && items.length > 0 && (
          <AddAddress mode="add" onAddressCreated={handleSaved}>
            <button type="button" className={addButtonClass}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add New Address
            </button>
          </AddAddress>
        )}
      </header>

      {status === "loading" && <AddressesSkeleton />}
      {status === "error" && (
        <OrderDetailsError
          title="We couldn't load your addresses"
          onRetry={() => {
            setStatus("loading");
            setAttempt((n) => n + 1);
          }}
        />
      )}
      {status === "ready" &&
        (items.length === 0 ? (
          <div className="rounded-md border border-[#E3DFD8] bg-[#FAF8F5] px-6 py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F0EDE7]">
              <MapPin className="h-5 w-5 text-[#454F45]" strokeWidth={1.6} aria-hidden="true" />
            </div>
            <h3 className="mt-5 text-xl font-semibold text-[#17181A]">No saved address</h3>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#857F73]">
              Add a delivery address to speed up checkout.
            </p>
            <AddAddress mode="add" onAddressCreated={handleSaved}>
              <button type="button" className={`${addButtonClass} mt-7`}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add Address
              </button>
            </AddAddress>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {sorted.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                isSettingDefault={defaultPending.has(address.id)}
                onSaved={handleSaved}
                onSetDefault={handleSetDefault}
                onDelete={setAddressToDelete}
              />
            ))}
          </div>
        ))}

      <DeleteAddressDialog
        address={addressToDelete}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setAddressToDelete(null)}
      />
    </section>
  );
}