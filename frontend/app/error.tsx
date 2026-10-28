"use client";

import Link from "next/link";

import { ErrorPage } from "@/components/error-pages/ErrorPage";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <ErrorPage
      eyebrow="Something went wrong"
      code="500"
      title="We're facing a temporary issue"
      description="We ran into an unexpected issue. Please try again in a few moments."
      primaryLabel="Try Again"
      onPrimaryAction={reset}
      secondaryLabel="Go to Home"
      secondaryHref="/"
      footerEyebrow="Still having problems?"
      footerContent={
        <div className="flex flex-col items-center gap-3">
          <p>Feel free to contact our support team.</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 font-medium text-[#302E2A] underline underline-offset-4 transition-colors hover:text-[#454F45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45]"
          >
            Contact Us
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      }
    />
  );
}
