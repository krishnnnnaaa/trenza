import { Skeleton } from "@/components/ui/skeleton";

// Mirrors OrderCard layout 1:1
export function OrdersSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4" role="status" aria-label="Loading orders">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-card">
          <div className="flex items-start justify-between gap-3 border-b p-4 sm:p-5">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-44" />
            </div>
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <div className="flex gap-2 p-4 sm:p-5">
            {[0, 1, 2].map((n) => (
              <Skeleton key={n} className="size-16 rounded-md sm:size-20" />
            ))}
          </div>
          <div className="flex items-center justify-between gap-3 border-t p-4 sm:p-5">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-9 w-28" />
          </div>
        </div>
      ))}
    </div>
  );
}