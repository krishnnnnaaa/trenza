"use client";

import { AlertDialog } from "@base-ui/react/alert-dialog";

import { Spinner } from "@/components/ui/spinner";
import type { AddressApiResponse } from "@/types/types";

interface DeleteAddressDialogProps {
  address: AddressApiResponse | null; // null = closed
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteAddressDialog({
  address,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteAddressDialogProps) {
  return (
    <AlertDialog.Root
      open={address !== null}
      onOpenChange={(open) => {
        if (!open && !isDeleting) onCancel();
      }}
    >
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="fixed inset-0 z-50 bg-[#17181A]/40 backdrop-blur-sm data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <AlertDialog.Popup className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-md border border-[#E3DFD8] bg-[#FCFBF9] p-6 text-[#332F2A] shadow-2xl outline-none data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
          <AlertDialog.Title className="text-xl font-semibold text-[#17181A]">
            Delete this address?
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-2 wrap-break-word text-sm leading-6 text-[#857F73]">
            {address
              ? `${address.fullName}, ${address.addressLine1}, ${address.city} will be removed from your saved addresses. This can't be undone.`
              : ""}
          </AlertDialog.Description>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <AlertDialog.Close
              disabled={isDeleting}
              render={
                <button
                  type="button"
                  className="h-11 rounded-md border border-[#E3DFD8] bg-transparent px-5 text-sm font-medium text-[#514B43] transition-colors hover:bg-[#F0EDE7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45]/30 disabled:opacity-60"
                />
              }
            >
              Cancel
            </AlertDialog.Close>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              aria-busy={isDeleting}
              className="flex h-11 items-center justify-center gap-2 rounded-md bg-destructive px-5 text-sm font-medium text-white transition-colors hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60"
            >
              {isDeleting && <Spinner className="h-4 w-4" />}
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}