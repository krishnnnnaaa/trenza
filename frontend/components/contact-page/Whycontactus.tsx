import { CreditCard, MessageCircle, Package, RefreshCw, type LucideIcon } from "lucide-react";

const REASONS: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Package, title: "Order support", text: "Get help with your orders, tracking and delivery." },
  { icon: RefreshCw, title: "Returns & exchanges", text: "Need to initiate a return? We'll guide you through it." },
  { icon: CreditCard, title: "Payment issues", text: "Facing a payment problem? We're here to help." },
  { icon: MessageCircle, title: "Product inquiries", text: "Have questions about a product? Feel free to ask us." },
];

export function WhyContactUs() {
  return (
    <section className="rounded-lg bg-[#F3F0E9] p-6 sm:p-8">
      <h2 className="font-serif text-2xl font-normal text-[#17181A]">Why contact us?</h2>
      <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {REASONS.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E6E1D6]">
              <Icon className="h-5 w-5 text-[#17181A]" strokeWidth={1.6} aria-hidden="true" />
            </span>
            <div className="min-w-0 text-sm">
              <p className="font-medium text-[#17181A]">{title}</p>
              <p className="mt-0.5 leading-5 text-[#857F73]">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}