// app/(app)/terms-and-conditions/page.tsx 
import { FileText, LockKeyhole, Package, CreditCard } from "lucide-react";
import type { Metadata } from "next";

import bannerImage from "@/assets/contact-banner.png";
import { PolicyPage } from "@/components/policy/Policypage";
import { TERMS_LAST_UPDATED } from "@/lib/constants/termConfig";
import { TERMS_SECTIONS } from "@/components/terms-page/Termssection";

export const metadata: Metadata = {
  title: "Terms & Conditions | Trenza",
  description: "The terms that apply when you use Trenza and place an order.",
};

export default function TermsPage() {
  return (
    <PolicyPage
      hero={{
        title: "Terms & Conditions",
        description:
          "By using Trenza, you agree to the following terms and conditions. Please read them carefully before making a purchase.",
        lastUpdated: TERMS_LAST_UPDATED,
        imageSrc: bannerImage.src,
      }}
      summary={{
        title: "Key points at a glance",
        description: "Here are some important things to know about using Trenza.",
        items: [
          {
            icon: LockKeyhole,
            title: "Use the site responsibly",
            text: "Follow our guidelines and applicable laws.",
          },
          {
            icon: CreditCard,
            title: "Make secure payments",
            text: "Online payments are processed by our payment provider, and we don't store your card details.",
          },
          {
            icon: Package,
            title: "Check our policies",
            text: "Review our shipping and returns information before ordering.",
          },
          {
            icon: FileText,
            title: "Terms may be updated",
            text: "We may update these terms from time to time.",
          },
        ],
      }}
      sections={TERMS_SECTIONS}
      banner={{
        image: bannerImage,
        alt: "Trenza contact banner",
        description:
          "If you have any questions about these Terms & Conditions or need further clarification, feel free to contact our support team.",
      }}
    />
  );
}