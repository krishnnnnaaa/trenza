import { CalendarCheck, CircleCheck, PackageCheck, RotateCcw } from "lucide-react";
import type { Metadata } from "next";

import bannerImage from "@/assets/contact-banner.png";
import { PolicyPage } from "@/components/policy/Policypage";
import { RETURNS_SECTIONS } from "@/components/returns-refunds-page/Returnssection";
import { RETURNS_LAST_UPDATED } from "@/lib/constants/returnsPolicyConfig";

export const metadata: Metadata = {
  title: "Returns & Refunds | Trenza",
  description: "Learn how Trenza handles return requests, refunds, exchanges and order support.",
};

export default function ReturnsAndRefundsPage() {
  return (
    <PolicyPage
      hero={{
        title: "Returns & Refunds",
        description:
          "We want you to be happy with your purchase. Here's everything you need to know about returning items and getting a refund.",
        lastUpdated: RETURNS_LAST_UPDATED,
        imageSrc: bannerImage,
      }}
      summary={{
        title: "Quick overview",
        description: "A quick summary of our returns and refunds process.",
        items: [
          {
            icon: PackageCheck,
            title: "Easy Returns",
            text: "Eligible items may be returned according to the applicable policy.",
          },
          {
            icon: RotateCcw,
            title: "Refund to Original Payment Method",
            text: "The refund destination depends on the approved payment flow.",
          },
          {
            icon: CircleCheck,
            title: "Check Eligibility",
            text: "Review the eligibility requirements before requesting a return.",
          },
          {
            icon: CalendarCheck,
            title: "Refund Processing",
            text: "Processing follows the applicable policy and payment-provider procedures.",
          },
        ],
      }}
      sections={RETURNS_SECTIONS}
      banner={{
        image: bannerImage,
        alt: "Trenza contact banner",
        description:
          "If you have any questions about returns, refunds, or need further assistance, feel free to contact our support team.",
      }}
    />
  );
}
