import { Receipt } from "lucide-react";
import { formatINR } from "@/lib/utils";
import { DetailCard } from "./DetailCard";
import { toPaise } from "@/lib/money";
import { OrderItem } from "@/types/types";

export function OrderSummary({
  items,
  totalAmount,
}: {
  items: OrderItem[];
  totalAmount: string;
}) {
  // Computed on the frontend: API has no subtotal field. No fake shipping/tax lines.
  const subtotal = items.reduce((sum, i) => sum + toPaise(i.price) * i.quantity, 0) / 100;
  return (
    <DetailCard title="Order Summary" icon={Receipt}>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd>{formatINR(subtotal)}</dd>
        </div>
        <div className="flex justify-between gap-4 border-t pt-3 text-base font-semibold">
          <dt>Total</dt>
          <dd>{formatINR(totalAmount)}</dd>
        </div>
      </dl>
    </DetailCard>
  );
}