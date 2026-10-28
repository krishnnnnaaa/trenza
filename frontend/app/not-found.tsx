import Link from "next/link";

import { ErrorPage } from "@/components/error-pages/ErrorPage";

export default function NotFound() {
  return (
    <ErrorPage
      eyebrow="Page not found"
      code="404"
      title="Looks like you're in the wrong place"
      description="The page you're looking for doesn't exist or may have been moved. Let's get you back on track."
      primaryLabel="Go to Home"
      primaryHref="/"
      secondaryLabel="Browse Shop"
      secondaryHref="/shop"
      footerEyebrow="Or explore popular links"
      footerContent={
        <nav aria-label="Popular links" className="flex flex-wrap justify-center gap-x-6 gap-y-3">
          {[
            ["Shop", "/shop"],
            ["New Arrivals", "/shop?sort=newest"],
            ["Women", "/categories"],
            ["Categories", "/categories"],
          ].map(([label, href]) => (
            <Link
              key={href + label}
              href={href}
              className="inline-flex items-center gap-2 text-[#302E2A] underline-offset-4 transition-colors hover:text-[#454F45] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45]"
            >
              {label}
              <span aria-hidden="true">→</span>
            </Link>
          ))}
        </nav>
      }
    />
  );
}
