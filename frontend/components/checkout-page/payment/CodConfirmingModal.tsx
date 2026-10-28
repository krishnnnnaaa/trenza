"use client";

import { AlertDialog } from "@base-ui/react/alert-dialog";
import { Banknote, Package } from "lucide-react";
import { useEffect, useState } from "react";

interface CodConfirmingModalProps {
  open: boolean;
  /** How long the progress bar takes to fill. Keep in sync with the delay in PaymentStep. */
  durationMs?: number;
}

/**
 * Non-dismissable "Confirming your order" modal.
 * AlertDialog = focus trap + aria-modal + scroll lock, and it ignores outside clicks.
 * `open` is fully controlled and onOpenChange is a no-op, so Escape can't close it either.
 */
export function CodConfirmingModal({ open, durationMs = 1400 }: CodConfirmingModalProps) {
  const [filling, setFilling] = useState(false);

  // start the width transition one tick AFTER mount so it animates from 0 -> 100%
  useEffect(() => {
    if (!open) {
      const id = window.setTimeout(() => setFilling(false), 0);
      return () => window.clearTimeout(id);
    }
    const id = window.setTimeout(() => setFilling(true), 30);
    return () => window.clearTimeout(id);
  }, [open]);

  return (
    <AlertDialog.Root open={open} onOpenChange={() => {}}>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="fixed inset-0 z-50 bg-[#17181A]/40 backdrop-blur-sm data-ending-style:opacity-0 data-starting-style:opacity-0 transition-opacity duration-200" />
        <AlertDialog.Popup className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-[#E3DFD8] bg-[#FAF8F5] px-6 py-9 text-center text-[#17181A] shadow-2xl outline-none transition-all duration-200 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 sm:px-10">
          {/* spinner ring + icon */}
          <div className="relative mx-auto h-16 w-16" aria-hidden="true">
            <div className="absolute inset-0 rounded-full border-2 border-[#E3DFD8]" />
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#454F45] motion-reduce:animate-none" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="h-6 w-6 text-[#454F45]" strokeWidth={1.6} />
            </div>
          </div>

          <AlertDialog.Title
            className="mt-6 text-2xl font-normal tracking-tight text-[#17181A]"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Confirming your order
          </AlertDialog.Title>

          <AlertDialog.Description className="mt-2 text-sm leading-6 text-[#857F73]">
            We&apos;re getting your order ready...
          </AlertDialog.Description>

          {/* progress */}
          <div
            className="mx-auto mt-6 h-1 w-full max-w-55 overflow-hidden rounded-full bg-[#E3DFD8]"
            aria-hidden="true"
          >
            <div
              className="h-full rounded-full bg-[#454F45] ease-out motion-reduce:transition-none"
              style={{
                width: filling ? "100%" : "0%",
                transitionProperty: "width",
                transitionDuration: `${durationMs}ms`,
              }}
            />
          </div>

          <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-[#857F73]">
            <Banknote className="h-3.5 w-3.5" aria-hidden="true" />
            Cash on Delivery
          </p>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}