import { PackageSearch } from "lucide-react";
import Link from "next/link";

interface ProductNotFoundProps {
  title?: string;
  description?: string;
}

/**
 * Empty-state shown when a product slug doesn't resolve to a real product.
 * Reusable on its own, or wired into app/products/[slug]/not-found.tsx
 * (see that file for how it hooks into Next's notFound() flow).
 */
export function ProductNotFound({
  title = "Product not found",
  description = "We couldn't find the product you're looking for. It may have been removed or the link may be incorrect.",
}: ProductNotFoundProps) {
  return (
    <section className="bg-[#FAF8F5] px-6 py-24 sm:py-32">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F0EDE7]">
          <PackageSearch
            className="h-6 w-6 text-[#454F45]"
            aria-hidden="true"
            strokeWidth={1.75}
          />
        </span>

        <h1 className="mt-6 font-serif text-2xl font-normal text-[#17181A] sm:text-3xl">
          {title}
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-[#857F73]">
          {description}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/shop"
            className="inline-flex h-11 items-center justify-center rounded-sm bg-[#17181A] px-6 text-sm font-medium text-white transition-colors duration-150 hover:bg-[#454F45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
          >
            Back to Shop
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-sm border border-[#E3DFD8] bg-transparent px-6 text-sm font-medium text-[#17181A] transition-colors duration-150 hover:bg-[#F0EDE7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
          >
            Go Home
          </Link>
        </div>
      </div>
    </section>
  );
}