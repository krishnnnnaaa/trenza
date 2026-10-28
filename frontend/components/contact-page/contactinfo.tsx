import { CONTACT_INFO } from "@/lib/constants/contactInfo";
import { ArrowRight, Mail, MapPin, MessageSquare, Phone, type LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";


function Row({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <li className="flex gap-4">
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#EDE9E2]">
        <Icon className="h-5 w-5 text-[#17181A]" strokeWidth={1.6} aria-hidden="true" />
      </span>
      <div className="min-w-0 pt-0.5 text-sm">
        <p className="font-medium text-[#17181A]">{title}</p>
        {children}
      </div>
    </li>
  );
}

const Note = ({ children }: { children: ReactNode }) => (
  <p className="mt-0.5 text-[#857F73]">{children}</p>
);

export function ContactInfo() {
  const { email, phone, address, liveChat } = CONTACT_INFO;

  return (
    <div className="flex flex-col">
      <h2 className="font-serif text-2xl font-normal text-[#17181A] sm:text-3xl">Other ways to reach us</h2>
      <p className="mt-2 text-sm text-[#857F73]">Prefer a different way? Here are our contact details.</p>

      <ul className="mt-6 flex flex-col gap-5">
        {email && (
          <Row icon={Mail} title="Email">
            <a
              href={`mailto:${email.value}`}
              className="mt-0.5 block break-all text-[#17181A] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45]"
            >
              {email.value}
            </a>
            {email.note && <Note>{email.note}</Note>}
          </Row>
        )}
        {phone && (
          <Row icon={Phone} title="Phone">
            <a
              href={`tel:${phone.value.replace(/[^\d+]/g, "")}`}
              className="mt-0.5 block text-[#17181A] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45]"
            >
              {phone.value}
            </a>
            {phone.note && <Note>{phone.note}</Note>}
          </Row>
        )}
        {address && (
          <Row icon={MapPin} title="Our Office">
            <address className="mt-0.5 not-italic text-[#17181A]">
              {address.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </Row>
        )}
        {liveChat && (
          <Row icon={MessageSquare} title="Live Chat">
            <p className="mt-0.5 text-[#17181A]">{liveChat.description}</p>
            {liveChat.note && <Note>{liveChat.note}</Note>}
          </Row>
        )}
      </ul>

      <aside className="mt-8 rounded-lg border border-[#E3DFD8] bg-[#EFEBE3] p-6">
        <h3 className="font-serif text-xl font-normal leading-snug text-[#17181A]">
          Need help with your order?
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-6 text-[#514B43]">
          Check our FAQs for quick answers about orders, shipping, returns, and more.
        </p>
        <Link
          href="#faq"
          className="mt-4 inline-flex h-10 items-center gap-2 rounded-md bg-[#454F45] px-4 text-sm font-medium text-white transition-colors hover:bg-[#332F2A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45]/40 focus-visible:ring-offset-2"
        >
          View FAQs
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </aside>
    </div>
  );
}