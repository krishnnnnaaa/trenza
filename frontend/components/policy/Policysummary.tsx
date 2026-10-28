import { cn } from "@/lib/utils";
import { PolicySummaryItem } from "@/types/types";

export interface PolicySummaryProps {
  title: string;
  description: string;
  items: PolicySummaryItem[];
  /** icon above, text centred (Terms reference). false = left aligned. */
  centered?: boolean;
}

export function PolicySummary({ title, description, items, centered = true }: PolicySummaryProps) {
  return (
    <section aria-labelledby="policy-summary" className="rounded-lg border border-[#E3DFD8] bg-[#F3F0E9] p-6 sm:p-7">
      <h2 id="policy-summary" className="font-serif text-2xl font-normal text-[#17181A]">
        {title}
      </h2>
      <p className="mt-1 text-sm text-[#857F73]">{description}</p>

      <ul className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {items.map(({ icon: Icon, title: itemTitle, text }) => (
          <li key={itemTitle} className={cn("flex flex-col gap-3", centered && "items-center text-center")}>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E6E1D6]">
              <Icon className="h-5 w-5 text-[#17181A]" strokeWidth={1.6} aria-hidden="true" />
            </span>
            <div className="text-sm">
              <p className="font-medium text-[#17181A]">
                {itemTitle}
              </p>
              <p className="mt-1 leading-5 text-[#857F73]">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}