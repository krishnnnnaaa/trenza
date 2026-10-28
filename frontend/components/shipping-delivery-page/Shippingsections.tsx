import { CONTACT_INFO } from "@/lib/constants/contactInfo";
import { Box,  Truck, Zap, type LucideIcon } from "lucide-react";
import Link from "next/link";

import type { PolicySectionData } from "@/types/types";
import { P } from "@/components/policy/PolicyText";

const contactEmail = CONTACT_INFO.email?.value;

function ShippingMethodCard({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <li className="flex items-center gap-3 rounded-md bg-[#F3F0E9] p-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E6E1D6]">
        <Icon className="h-4 w-4 text-[#454F45]" strokeWidth={1.6} aria-hidden="true" />
      </span>
      <div>
        <p className="text-xs font-medium text-[#17181A]">{title}</p>
        <p className="mt-0.5 text-xs leading-4 text-[#857F73]">{text}</p>
      </div>
    </li>
  );
}

export const SHIPPING_SECTIONS: PolicySectionData[] = [
  {
    id: "overview",
    number: "01",
    title: "Overview",
    content: (
      <P>
        This policy explains how Trenza prepares orders, uses the delivery information provided at checkout, and
        communicates order status. Standard delivery is available for serviceable addresses entered during checkout.
      </P>
    ),
  },
  {
    id: "order-processing",
    number: "02",
    title: "Order Processing",
    content: (
      <>
        <P>
          After an order is placed, Trenza records the selected delivery address and payment method. Online orders are
          processed after payment is verified through Razorpay. Cash on Delivery orders are recorded as pending payment
          orders and are included in the customer&rsquo;s order history.
        </P>
        <P>
          Customers can review their orders from{" "}
          <Link href="/orders" className="text-[#454F45] underline underline-offset-4">
            My Orders
          </Link>
          .
        </P>
      </>
    ),
  },
  {
    id: "shipping-methods",
    number: "03",
    title: "Shipping Methods",
    content: (
      <>
        <P>
          Trenza currently offers standard shipping. Express and same-day delivery are not available through the
          checkout flow.
        </P>
        <ul className="grid gap-3 sm:grid-cols-3">
          <ShippingMethodCard icon={Truck} title="Standard Shipping" text="Available for serviceable addresses." />
          <ShippingMethodCard icon={Zap} title="Express Shipping" text="Not currently available." />
          <ShippingMethodCard icon={Box} title="Same-Day or Local Delivery" text="Not currently available." />
        </ul>
      </>
    ),
  },
  {
    id: "delivery-timeline",
    number: "04",
    title: "Delivery Timeline",
    content: (
      <P>
        Delivery typically takes 5–7 business days after order processing. The actual arrival date can vary based on
        the destination, address and local delivery conditions, so delivery dates are estimates rather than guarantees.
      </P>
    ),
  },
  {
    id: "shipping-charges",
    number: "05",
    title: "Shipping Charges",
    content: (
      <P>
        Standard shipping is complimentary for all orders. Any applicable charge will be shown in the order summary
        before the customer completes payment.
      </P>
    ),
  },
  {
    id: "order-tracking",
    number: "06",
    title: "Order Tracking",
    content: (
      <>
        <P>
          Customers can view the order status and order details from{" "}
          <Link href="/orders" className="text-[#454F45] underline underline-offset-4">
            My Orders
          </Link>
          . Order status is updated as the order moves through processing and delivery. Live courier tracking is not
          currently available.
        </P>
      </>
    ),
  },
  {
    id: "delivery-areas",
    number: "07",
    title: "Delivery Areas",
    content: (
      <P>
        Delivery is available to serviceable addresses entered during checkout. Availability may vary by city,
        postal code and local delivery coverage.
      </P>
    ),
  },
  {
    id: "delays-and-exceptions",
    number: "08",
    title: "Delays and Exceptions",
    content: (
      <>
        <P>
          Delivery may be affected by address issues, operational conditions, events outside Trenza&rsquo;s control or
          an unavailable delivery arrangement. If an order is delayed, customers should contact support with their
          order ID so the team can review the latest available information.
        </P>
        <P>Support will share the latest available order update when a delay is reported.</P>
      </>
    ),
  },
  {
    id: "failed-deliveries",
    number: "09",
    title: "Failed Deliveries",
    content: (
      <P>
        If a delivery cannot be completed, the delivery partner may attempt delivery again or return the package to
        Trenza. Contact support with the order ID so the next step can be arranged.
      </P>
    ),
  },
  {
    id: "lost-or-damaged-packages",
    number: "10",
    title: "Lost or Damaged Packages",
    content: (
      <>
        <P>
          Report a package that appears lost or arrives damaged through the{" "}
          <Link href="/contact" className="text-[#454F45] underline underline-offset-4">
            Contact Us page
          </Link>
          . Include your order ID, a description of the issue and clear photos where helpful.
        </P>
        <P>Support will review the issue and arrange the appropriate resolution for the order.</P>
      </>
    ),
  },
  {
    id: "incorrect-address",
    number: "11",
    title: "Incorrect Address",
    content: (
      <>
        <P>
          Review your saved delivery address carefully before placing an order. Address details can be managed from{" "}
          <Link href="/account/addresses" className="text-[#454F45] underline underline-offset-4">
            My Addresses
          </Link>
          .
        </P>
        <P>
          If you notice an error after placing an order, contact support promptly with the order ID. The current
          application does not provide an address-edit action for an existing order, and changes may not be possible
          after dispatch.
        </P>
      </>
    ),
  },
  {
    id: "contact-us",
    number: "12",
    title: "Contact Us",
    content: (
      <P>
        Questions about shipping or delivery? Visit our{" "}
        <Link href="/contact" className="text-[#454F45] underline underline-offset-4">
          Contact page
        </Link>
        {contactEmail && (
          <>
            {" "}or email{" "}
            <a href={`mailto:${contactEmail}`} className="text-[#454F45] underline underline-offset-4">
              {contactEmail}
            </a>
          </>
        )}
        .
      </P>
    ),
  },
];
