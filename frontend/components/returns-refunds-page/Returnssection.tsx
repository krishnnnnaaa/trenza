import { CONTACT_INFO } from "@/lib/constants/contactInfo";
import type { PolicySectionData } from "@/types/types";
import Link from "next/link";

import { CheckItem, P, PolicyList } from "@/components/policy/PolicyText";

const contactEmail = CONTACT_INFO.email?.value;

export const RETURNS_SECTIONS: PolicySectionData[] = [
  {
    id: "our-return-policy",
    number: "01",
    title: "Our Return Policy",
    content: (
      <>
        <P>
          We want you to be happy with your purchase. Eligible items may be returned within 14 days of delivery.
          Every request is reviewed using the order details and the condition of the returned item.
        </P>
        <P>
          Return requests are accepted when the item meets the eligibility requirements below.
        </P>
      </>
    ),
  },
  {
    id: "eligibility-for-returns",
    number: "02",
    title: "Eligibility for Returns",
    content: (
      <>
        <P>To be eligible for a return, an item must:</P>
        <ul className="grid gap-x-8 gap-y-3 text-sm leading-6 text-[#514B43] sm:grid-cols-2">
          <CheckItem>Item condition and whether it is unused</CheckItem>
          <CheckItem>Original packaging, labels and included accessories</CheckItem>
          <CheckItem>Order details or other proof of purchase</CheckItem>
          <CheckItem>Be requested within 14 days of delivery</CheckItem>
        </ul>
      </>
    ),
  },
  {
    id: "non-returnable-items",
    number: "03",
    title: "Non-Returnable Items",
    content: (
      <>
        <P>The following items are not eligible for return:</P>
        <PolicyList>
          <li>Items marked as final sale or non-returnable</li>
          <li>Gift cards and store credit</li>
          <li>Personalised or customised items</li>
          <li>Items that have been worn, washed, altered or damaged after delivery</li>
        </PolicyList>
      </>
    ),
  },
  {
    id: "how-to-initiate-a-return",
    number: "04",
    title: "How to Initiate a Return",
    content: (
      <>
        <P>To request a return:</P>
        <PolicyList>
          <li>Find the relevant order in <Link href="/orders" className="text-[#454F45] underline underline-offset-4">My Orders</Link>.</li>
          <li>Keep the order ID and item details available.</li>
          <li>Contact the support team with the request and any relevant photos or context.</li>
        </PolicyList>
      </>
    ),
  },
  {
    id: "return-shipping",
    number: "05",
    title: "Return Shipping",
    content: (
      <>
        <P>
          Once a return request is approved, support will share the return-shipping instructions. Customers should
          package the item securely and use the provided instructions. Return shipping is the customer’s
          responsibility unless the item is damaged, defective or incorrect.
        </P>
      </>
    ),
  },
  {
    id: "refund-process",
    number: "06",
    title: "Refund Process",
    content: (
      <>
        <P>
          Approved refunds are initiated after the returned item is received and reviewed. Online orders use Razorpay
          for payment processing, and the refund is sent to the original payment method.
        </P>
        <P>
          For Cash on Delivery orders, support will collect the details needed to arrange the approved refund.
        </P>
      </>
    ),
  },
  {
    id: "refund-timeline",
    number: "07",
    title: "Refund Timeline",
    content: (
      <P>
        Approved refunds are processed within 5–7 business days after the return has been received and accepted. The
        time taken for the amount to appear may vary depending on the payment provider and bank.
      </P>
    ),
  },
  {
    id: "exchanges",
    number: "08",
    title: "Exchanges",
    content: (
      <>
        <P>
          Exchanges are not offered through the current order flow. Customers may request a return for an eligible item
          and place a new order for the preferred size or style.
        </P>
      </>
    ),
  },
  {
    id: "damaged-or-incorrect-items",
    number: "09",
    title: "Damaged or Incorrect Items",
    content: (
      <>
        <P>
          Contact Trenza support as soon as possible with your order ID, a description of the issue and clear photos
          where useful. The support form is available on the <Link href="/contact" className="text-[#454F45] underline underline-offset-4">Contact Us page</Link>.
        </P>
        <P>
          Damaged, defective or incorrect items are reviewed as a priority, and Trenza may arrange a replacement,
          return or refund after reviewing the details.
        </P>
      </>
    ),
  },
  {
    id: "order-cancellations",
    number: "10",
    title: "Order Cancellations",
    content: (
      <>
        <P>
          Cancellation requests can be made through the Contact Us page as soon as possible after placing an order.
          Requests are accepted when the order has not yet been dispatched. Once dispatched, the order must follow the
          returns process.
        </P>
      </>
    ),
  },
  {
    id: "important-notes",
    number: "11",
    title: "Important Notes",
    content: (
      <PolicyList>
        <li>Keep your order confirmation and order ID available when contacting support.</li>
        <li>Do not send a return until Trenza has reviewed the request and provided instructions.</li>
        <li>Payment-provider processing and bank posting times may be outside Trenza’s control.</li>
        <li>Refunds can only be processed after the returned item has been received and approved.</li>
      </PolicyList>
    ),
  },
  {
    id: "contact-us",
    number: "12",
    title: "Contact Us",
    content: (
      <P>
        Questions about a return or refund? Visit our{" "}
        <Link href="/contact" className="text-[#454F45] underline underline-offset-4">Contact page</Link>
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
