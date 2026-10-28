export { cn } from "cn"

// Types derived from your existing OrdersResponse -> no duplicate type definitions
// export type Order = OrdersResponse["data"][number];
// export type OrderItem = Order["items"][number];

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });

// API returns prices as strings ("599.96")
export function formatINR(value: string | number): string {
  const n = Number(value);
  return Number.isFinite(n) ? inr.format(n) : "—";
}

export function formatOrderDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export function truncateText(text:string, maxLength: number = 10):string {
      if (text.length <= maxLength) {
        return text;
      }
      return text.slice(0, maxLength) + '...';
    }