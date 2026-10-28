import { Skeleton } from "@/components/ui/skeleton";

export function OrderDetailsSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-3" role="status" aria-label="Loading order details">
      <div className="space-y-4 rounded-xl border bg-card p-4 sm:p-5 lg:col-span-2">
        <Skeleton className="h-5 w-24" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="size-20 shrink-0 rounded-md sm:size-24" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="h-5 w-16" />
          </div>
        ))}
      </div>
      <div className="space-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-3 rounded-xl border bg-card p-4 sm:p-5">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}