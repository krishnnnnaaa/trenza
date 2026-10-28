import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

// Shared shell for summary / address / payment cards (zero duplication)
export function DetailCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border bg-card p-4 text-card-foreground sm:p-5">
      <h2 className="mb-3 flex items-center gap-2 text-base font-semibold">
        <Icon className="size-4 text-muted-foreground" aria-hidden />
        {title}
      </h2>
      {children}
    </section>
  );
}