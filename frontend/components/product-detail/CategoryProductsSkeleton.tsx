import { Skeleton } from "@/components/ui/skeleton";

const SKELETON_COUNT = 4;

function CategoryProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-[#E3DFD8] bg-[#FAF8F5]">
      <Skeleton className="aspect-4/3 w-full rounded-none bg-[#F0EDE7]" />
      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-3/4 bg-[#F0EDE7]" />
          <Skeleton className="h-3.5 w-full bg-[#F0EDE7]" />
        </div>
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

export function CategoryProductsSkeleton() {
  return (
    <section
      className="mt-16"
      role="status"
      aria-label="Loading related products"
    >
      <Skeleton className="h-8 w-56 bg-[#F0EDE7]" />

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <CategoryProductCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}