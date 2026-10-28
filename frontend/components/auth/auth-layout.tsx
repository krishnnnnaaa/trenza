import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { fraunces, inter } from "@/fonts/fonts";
import Image from "next/image";
import logo from "@/public/logo.png";


interface AuthLayoutProps {
  /** Path to the editorial image shown on the left, on tablet and up. */
  imageSrc?: string;
  imageAlt?: string;
  heading: string;
  children: ReactNode;
}

/**
 * Shared split-screen shell for /login and /signup.
 * Intentionally standalone: does not render the app's main navbar/footer.
 */
export function AuthLayout({
  imageSrc,
  imageAlt = "",
  heading,
  children,
}: AuthLayoutProps) {
  return (
    <div
      className={cn(
        fraunces.variable,
        inter.variable,
        "flex min-h-screen w-full bg-[#FAF8F5] font-sans text-[#17181A] antialiased",
      )}
      style={{ ["--font-sans" as string]: "var(--font-inter)" }}
    >
      {/* Image side — hidden on mobile, ~40% on tablet, 50% on desktop */}
      <div
        className="relative hidden bg-[#1B1B19] md:block md:w-[40%] lg:w-1/2"
        aria-hidden="true"
      >
        {/* Swap this background-image for a real asset at the same path */}
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${imageSrc})` }}
          role="img"
          aria-label={imageAlt}
        />
      </div>

      {/* Form side */}
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-10 md:w-[60%] md:px-12 lg:w-1/2 lg:px-20">
        <div className="mx-auto flex w-full max-w-100 flex-col">
          <Link
            href="/"
            className="mb-12 w-fit font-serif text-2xl tracking-tight text-[#17181A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            <Image src={logo} alt="Trenza" width={200} height={200} />
          </Link>

          <h1
            className="mb-8 text-3xl font-normal leading-tight text-[#17181A] sm:text-4xl"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            {heading}
          </h1>

          {children}
        </div>
      </div>
    </div>
  );
}