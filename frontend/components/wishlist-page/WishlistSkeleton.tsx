import { Skeleton } from "@/components/ui/skeleton";

// Mirrors ProductCard: 4/3 image, name, description, stock, price + actions
export function WishlistSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div
      role="status"
      aria-label="Loading wishlist"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-lg border border-[#E3DFD8] bg-[#FAF8F5]"
        >
          <Skeleton className="aspect-4/3 w-full rounded-none bg-[#F0EDE7]" />
          <div className="space-y-3 p-4">
            <Skeleton className="h-5 w-3/4 bg-[#F0EDE7]" />
            <Skeleton className="h-4 w-full bg-[#F0EDE7]" />
            <Skeleton className="h-3 w-16 bg-[#F0EDE7]" />
            <div className="flex items-center justify-between pt-1">
              <Skeleton className="h-6 w-16 bg-[#F0EDE7]" />
              <Skeleton className="size-9 rounded-sm bg-[#F0EDE7]" />
            </div>
            <Skeleton className="h-9 w-full rounded-sm bg-[#F0EDE7]" />
          </div>
        </div>
      ))}
    </div>
  );
}