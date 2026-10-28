import {
  CheckCircle2,
  Clock,
  Loader2,
  PackageCheck,
  Truck,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

type StatusConfig = { label: string; icon: LucideIcon; className: string };

// Single source of truth for status styling. New status = one new line here.
const STATUS_CONFIG: Record<string, StatusConfig> = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
  },
  processing: {
    label: "Processing",
    icon: Loader2,
    className: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    className: "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300",
  },
  fulfilled: {
    label: "Fulfilled",
    icon: CheckCircle2,
    className: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
  },
  delivered: {
    label: "Delivered",
    icon: PackageCheck,
    className: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    className: "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
  },
};

const FALLBACK_CLASS = "border-border bg-muted text-muted-foreground";

export function OrderStatusBadge({ status }: { status: string }) {
  const key = status.toLowerCase();
  const config = STATUS_CONFIG[key];
  const Icon = config?.icon ?? Clock;
  const label = config?.label ?? key.charAt(0).toUpperCase() + key.slice(1);

  return (
    <Badge variant="outline" className={`gap-1.5 ${config?.className ?? FALLBACK_CLASS}`}>
      <Icon className="size-3.5" aria-hidden />
      {label}
    </Badge>
  );
}