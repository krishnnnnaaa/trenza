import { CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/utils";
import { DetailCard } from "./DetailCard";
import type { OrderPayment } from "@/types/types";

const PAYMENT_STATUS_CLASS: Record<string, string> = {
  paid: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
  pending: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
  failed: "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
};
const FALLBACK_CLASS = "border-border bg-muted text-muted-foreground";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

const PROVIDER_LABEL: Record<string, string> = {
  razorpay: "Razorpay",
  "cash-on-delivery": "Cash on Delivery",
};

// Only customer-facing fields; provider/order/payment IDs are intentionally not rendered
export function PaymentInfoCard({ payment }: { payment: OrderPayment }) {
  if (!payment) {
    return (
      <DetailCard title="Payment" icon={CreditCard}>
        <p className="text-sm text-muted-foreground">Payment information unavailable.</p>
      </DetailCard>
    );
  }

  const status = payment.status.toLowerCase();

  return (
    <DetailCard title="Payment" icon={CreditCard}>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Method</dt>
          <dd>{PROVIDER_LABEL[payment.provider] || capitalize(payment.provider)}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted-foreground">Status</dt>
          <dd>
            <Badge variant="outline" className={PAYMENT_STATUS_CLASS[status] ?? FALLBACK_CLASS}>
              {capitalize(payment.status)}
            </Badge>
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Amount</dt>
          <dd className="font-medium">{formatINR(payment.amount)}</dd>
        </div>
      </dl>
    </DetailCard>
  );
}