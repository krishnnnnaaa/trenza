"use client";

import { Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { cn } from "@/lib/utils";

// Neutral answers on purpose: no invented policy durations or guarantees.
// TODO: when your return / shipping policy pages exist, link them from the answers.
const FAQS = [
  {
    id: "track",
    question: "How can I track my order?",
    answer: (
      <>
        You can see the status of every order in{" "}
        <Link href="/orders" className="text-[#454F45] underline underline-offset-4">
          My Orders
        </Link>{" "}
        once you&rsquo;re signed in.
      </>
    ),
  },
  {
    id: "returns",
    question: "What is your return policy?",
    answer: "For returns and refunds, send us a message with your order ID and we'll guide you through the next steps.",
  },
  {
    id: "delivery",
    question: "How long does delivery take?",
    answer: "Delivery time depends on your location and the items in your order. Contact us with your order ID for an update on a specific order.",
  },
  {
    id: "cancel",
    question: "How do I cancel my order?",
    answer: "Please contact us as soon as possible with your order ID and we'll let you know what can be done.",
  },
];

export function FaqPreview() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section id="faq" aria-labelledby="faq-heading" className="scroll-mt-24 py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#857F73]">Quick Help</p>
        <h2 id="faq-heading" className="mt-2 font-serif text-3xl font-normal text-[#17181A] sm:text-4xl">
          Frequently asked questions
        </h2>
        <p className="mt-2 text-sm text-[#857F73]">You might find the answer you&rsquo;re looking for in our FAQs.</p>

        <ul className="mt-8 grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FAQS.map((faq) => {
            const open = openId === faq.id;
            return (
              <li key={faq.id} className="rounded-md border border-[#E3DFD8] bg-[#FCFBF9]">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : faq.id)}
                    aria-expanded={open}
                    aria-controls={`faq-panel-${faq.id}`}
                    id={`faq-trigger-${faq.id}`}
                    className="flex w-full items-center justify-between gap-3 rounded-md px-4 py-3.5 text-left text-sm text-[#17181A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45]"
                  >
                    {faq.question}
                    {open ? (
                      <Minus className="h-4 w-4 shrink-0 text-[#857F73]" aria-hidden="true" />
                    ) : (
                      <Plus className="h-4 w-4 shrink-0 text-[#857F73]" aria-hidden="true" />
                    )}
                  </button>
                </h3>
                <div
                  id={`faq-panel-${faq.id}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${faq.id}`}
                  hidden={!open}
                  className={cn("px-4 pb-4 text-sm leading-6 text-[#857F73]")}
                >
                  {faq.answer}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}