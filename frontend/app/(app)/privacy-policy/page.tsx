// app/(app)/privacy-policy/page.tsx  (navbar + footer come from your existing layout)
import { ClipboardList, ShieldCheck, ShoppingBag, SlidersHorizontal } from "lucide-react";
import type { Metadata } from "next";

import bannerImage from "@/assets/contact-banner.png";
import { PRIVACY_SECTIONS } from "@/components/privacy-policy-page/Policysection";
import { PolicyPage } from "@/components/policy/Policypage";
import { PRIVACY_LAST_UPDATED } from "@/lib/constants/privacyPolicyConfig";

export const metadata: Metadata = {
  title: "Privacy Policy | Trenza",
  description: "How Trenza collects, uses and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      hero={{
        title: "Privacy Policy",
        description:
          "We value your trust. This Privacy Policy explains how Trenza collects, uses, and protects your personal information.",
        lastUpdated: PRIVACY_LAST_UPDATED,
        imageSrc: bannerImage,
      }}
      summary={{
        title: "Quick summary",
        description: "Here’s a simple overview of how we handle your information.",
        items: [
          {
            icon: ClipboardList,
            title: "We collect what you share",
            text: "Account, delivery, order and support details needed to run the store.",
          },
          {
            icon: ShoppingBag,
            title: "We use it to run orders",
            text: "To manage accounts, process orders, deliver purchases and answer messages.",
          },
          {
            icon: ShieldCheck,
            title: "We protect your details",
            text: "Passwords are hashed and card details are handled by our payment provider.",
          },
          {
            icon: SlidersHorizontal,
            title: "You can manage your details",
            text: "Update your name and saved addresses from My Account.",
          },
        ],
      }}
      sections={PRIVACY_SECTIONS}
      banner={{
        image: bannerImage,
        alt: "Trenza contact banner",
        description:
          "If you have any questions about this Privacy Policy or how we handle your data, feel free to contact our support team.",
      }}
    />
  );
}