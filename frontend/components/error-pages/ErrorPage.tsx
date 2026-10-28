"use client";

import { ArrowRight, RotateCcw } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ShopProvider } from "@/app/context/ShopContent";

interface ErrorPageProps {
  eyebrow: string;
  code: string;
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref?: string;
  onPrimaryAction?: () => void;
  secondaryLabel: string;
  secondaryHref: string;
  footerEyebrow: string;
  footerContent: ReactNode;
}

export function ErrorPage({
  eyebrow,
  code,
  title,
  description,
  primaryLabel,
  primaryHref,
  onPrimaryAction,
  secondaryLabel,
  secondaryHref,
  footerEyebrow,
  footerContent,
}: ErrorPageProps) {
  return (
    <ShopProvider>
      <div className="flex min-h-screen flex-col bg-[#FAF8F5]">
        <Navbar />
        <main className="flex flex-1 items-center px-6 py-20 sm:py-28">
          <div className="mx-auto w-full max-w-3xl text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#857F73]">{eyebrow}</p>
            <p className="mt-5 font-serif text-[clamp(7rem,20vw,11rem)] font-normal leading-none tracking-[-0.06em] text-[#5D554A]">
              {code}
            </p>
            <h1 className="mx-auto mt-3 max-w-2xl font-serif text-3xl font-normal leading-tight text-[#17181A] sm:text-5xl">
              {title}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#625E57] sm:text-base">
              {description}
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              {onPrimaryAction ? (
                <button
                  type="button"
                  onClick={onPrimaryAction}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#343A29] px-7 text-sm font-medium text-white transition-colors hover:bg-[#454F45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
                >
                  {primaryLabel}
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : (
                <Link
                  href={primaryHref ?? "/"}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#343A29] px-7 text-sm font-medium text-white transition-colors hover:bg-[#454F45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
                >
                  {primaryLabel}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              )}
              <Link
                href={secondaryHref}
                className="inline-flex h-11 items-center justify-center rounded-md border border-[#A9A397] bg-transparent px-7 text-sm font-medium text-[#302E2A] transition-colors hover:bg-[#F0EDE7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
              >
                {secondaryLabel}
              </Link>
            </div>

            <div className="mx-auto mt-10 flex max-w-xl items-center gap-4 text-[10px] font-medium uppercase tracking-[0.2em] text-[#857F73]">
              <span className="h-px flex-1 bg-[#E3DFD8]" />
              <span>{footerEyebrow}</span>
              <span className="h-px flex-1 bg-[#E3DFD8]" />
            </div>
            <div className="mt-5 text-sm text-[#514B43]">{footerContent}</div>
          </div>
        </main>
        <Footer />
      </div>
    </ShopProvider>
  );
}
