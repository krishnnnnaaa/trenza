import { Skeleton } from "@/components/ui/skeleton";

// Matches the number of items a typical results page shows, purely so the
// skeleton fills roughly the same space as real results — not tied to
// actual pagination data (none is available yet during "loading").
const SKELETON_COUNT = 8;

function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-[#E3DFD8] bg-[#FAF8F5]">
      <Skeleton className="aspect-4/3 w-full rounded-none bg-[#F0EDE7]" />
      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-3/4 bg-[#F0EDE7]" />
          <Skeleton className="h-3.5 w-full bg-[#F0EDE7]" />
          <Skeleton className="h-3.5 w-2/3 bg-[#F0EDE7]" />
        </div>
        <Skeleton className="h-3 w-16 bg-[#F0EDE7]" />
        <div className="mt-auto flex items-center justify-between pt-1">
          <Skeleton className="h-5 w-14 bg-[#F0EDE7]" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-sm bg-[#F0EDE7]" />
            <Skeleton className="h-9 w-16 rounded-sm bg-[#F0EDE7]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductListItemSkeleton() {
  return (
    <div className="flex gap-4 rounded-lg border border-[#E3DFD8] bg-[#FAF8F5] p-3 sm:gap-6 sm:p-4">
      <Skeleton className="h-24 w-24 shrink-0 rounded-md bg-[#F0EDE7] sm:h-32 sm:w-32" />
      <div className="flex flex-1 flex-col justify-between gap-2 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-1/3 bg-[#F0EDE7]" />
          <Skeleton className="h-3.5 w-2/3 bg-[#F0EDE7]" />
          <Skeleton className="h-3 w-16 bg-[#F0EDE7]" />
        </div>
        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-3">
          <Skeleton className="h-5 w-14 bg-[#F0EDE7]" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-sm bg-[#F0EDE7]" />
            <Skeleton className="h-9 w-16 rounded-sm bg-[#F0EDE7]" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface ProductResultsSkeletonProps {
  view: "grid" | "list";
}

export function ProductResultsSkeleton({ view }: ProductResultsSkeletonProps) {
  const items = Array.from({ length: SKELETON_COUNT });

  if (view === "list") {
    return (
      <div
        className="mt-6 flex flex-col gap-4"
        role="status"
        aria-label="Loading products"
      >
        {items.map((_, index) => (
          <ProductListItemSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div
      className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      role="status"
      aria-label="Loading products"
    >
      {items.map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}