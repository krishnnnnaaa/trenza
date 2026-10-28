import { CalendarClock, MapPin, PackageCheck, Truck } from "lucide-react";
import type { Metadata } from "next";

import bannerImage from "@/assets/contact-banner.png";
import { PolicyPage } from "@/components/policy/Policypage";
import { SHIPPING_SECTIONS } from "@/components/shipping-delivery-page/Shippingsections";
import { SHIPPING_LAST_UPDATED } from "@/lib/constants/shippingPolicyConfig";

export const metadata: Metadata = {
  title: "Shipping & Delivery | Trenza",
  description: "Learn how Trenza processes, ships and delivers orders.",
};

export default function ShippingAndDeliveryPage() {
  return (
    <PolicyPage
      hero={{
        title: "Shipping & Delivery",
        description:
          "Here's everything you need to know about how we process, ship, and deliver your orders.",
        lastUpdated: SHIPPING_LAST_UPDATED,
        imageSrc: bannerImage,
      }}
      summary={{
        title: "Key information",
        description: "A quick overview of our shipping and delivery process.",
        items: [
          {
            icon: PackageCheck,
            title: "Order Processing",
            text: "Orders are prepared after placement and payment confirmation.",
          },
          {
            icon: Truck,
            title: "Shipping Options",
            text: "Available shipping methods require business confirmation.",
          },
          {
            icon: MapPin,
            title: "Track Your Order",
            text: "Review order status and details through My Orders.",
          },
          {
            icon: CalendarClock,
            title: "Estimated Delivery",
            text: "Estimates depend on the approved arrangement and destination.",
          },
        ],
      }}
      sections={SHIPPING_SECTIONS}
      banner={{
        image: bannerImage,
        alt: "Trenza contact banner",
        description:
          "If you have any questions about shipping, delivery, or need further assistance, feel free to contact our support team.",
      }}
    />
  );
}
