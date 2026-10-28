import { AlertCircle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OrdersError({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center rounded-xl border px-6 py-16 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="size-6 text-destructive" aria-hidden />
      </div>
      <h2 className="text-lg font-semibold">We couldn&apos;t load your orders</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Check your connection or sign in again, then try once more.
      </p>
      <Button variant="outline" onClick={onRetry} className="mt-6 gap-2">
        <RotateCw className="size-4" aria-hidden />
        Try again
      </Button>
    </div>
  );
}