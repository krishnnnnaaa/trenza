// app/(app)/contact/page.tsx  (navbar + footer come from your existing layout)
import { ContactForm } from "@/components/contact-page/Contactform";
import { ContactHero } from "@/components/contact-page/Contacthero";
import { ContactInfo } from "@/components/contact-page/contactinfo";
import { FaqPreview } from "@/components/contact-page/Faqpreview";
import { OfficeCard } from "@/components/contact-page/Officecard";
import { WhyContactUs } from "@/components/contact-page/Whycontactus";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Trenza",
  description: "Have a question or need help with an order? Get in touch with the Trenza team.",
};

export default function ContactPage() {
  return (
    <div className="bg-[#faf8f5]">
      <ContactHero />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-10">
          <ContactForm />
          <ContactInfo />
        </div>

        <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[1fr_2fr] [&>*:only-child]:lg:col-span-full">
          <OfficeCard />
          <WhyContactUs />
        </div>
      </div>
    <Separator/>
      <FaqPreview />
    </div>
  );
}