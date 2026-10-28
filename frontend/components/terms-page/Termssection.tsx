import Link from "next/link";

import { P, PolicyList } from "@/components/policy/PolicyText";
import { PolicySectionData } from "@/types/types";
import { CONTACT_INFO } from "@/lib/constants/contactInfo";

const contactEmail = CONTACT_INFO.email?.value;

export const TERMS_SECTIONS: PolicySectionData[] = [
  {
    id: "introduction",
    number: "01",
    title: "Introduction",
    content: (
      <>
        <P>
          These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern your use of the Trenza website and services. By
          accessing or using our website, you agree to be bound by these Terms. If you do not agree, please do not use
          the website.
        </P>
        <P>
          These Terms apply to everyone who browses the store, creates an account or places an order.
        </P>
      </>
    ),
  },
  {
    id: "about-trenza",
    number: "02",
    title: "About Trenza",
    content: (
      <P>
        Trenza is an online fashion and lifestyle store offering a range of products. We may modify, suspend or
        discontinue any part of the website or services from time to time.
      </P>
    ),
  },
  {
    id: "use-of-our-website",
    number: "03",
    title: "Use of Our Website",
    content: (
      <>
        <P>You agree to use our website only for lawful purposes and in a way that does not violate the rights of others. In particular, you agree not to:</P>
        <PolicyList>
          <li>Use the website for any unlawful or fraudulent purpose</li>
          <li>Try to gain unauthorised access to the website, other accounts or our systems</li>
          <li>Introduce malicious code or interfere with how the website works</li>
          <li>Provide false or misleading information</li>
        </PolicyList>
      </>
    ),
  },
  {
    id: "products-and-orders",
    number: "04",
    title: "Products and Orders",
    content: (
      <>
        <P>
          We make every effort to display product information, colours and prices accurately, but we do not guarantee
          that all information is free of errors. Availability can change; products are shown as in stock or out of stock.
        </P>
        <P>
          Placing an order is an offer to buy. We may accept, refuse or cancel an order, for example because of stock,
          pricing errors or suspected misuse.
        </P>
      </>
    ),
  },
  {
    id: "pricing-and-payment",
    number: "05",
    title: "Pricing and Payment",
    content: (
      <>
        <P>
          Prices are shown on the website in <strong>Indian Rupees (INR)</strong>.
        </P>
        <P>You can pay in the following ways:</P>
        <PolicyList>
          <li>
            <strong>Online payment</strong> through our payment provider. An online order is confirmed once the payment is
            verified. We do not store your card or bank details.
          </li>
          <li>
            <strong>Cash on Delivery</strong>, paid in cash when your order is delivered.
          </li>
        </PolicyList>
        <P>Any shipping charge is shown in the order summary before you complete your purchase.</P>
      </>
    ),
  },
  {
    id: "shipping-and-delivery",
    number: "06",
    title: "Shipping and Delivery",
    content: (
      <P>
        We aim to dispatch and deliver orders as soon as reasonably possible. Delivery times may vary based on your
        location and factors beyond our control, so any dates shown are estimates, not guarantees.
      </P>
    ),
  },
  {
    id: "returns-and-refunds",
    number: "07",
    title: "Returns and Refunds",
    content: (
      <P>
        If you have a problem with an order, please contact us with your order ID and we will let you know the next steps.
        Details of eligibility, timelines and refund methods will be set out in our Returns &amp; Refunds policy.
      </P>
    ),
  },
  {
    id: "account-responsibilities",
    number: "08",
    title: "Account Responsibilities",
    content: (
      <>
        <P>To place orders you may need an account. You are responsible for:</P>
        <PolicyList>
          <li>Giving accurate details and keeping them up to date</li>
          <li>Verifying your email address and keeping your password confidential</li>
          <li>All activity that happens under your account</li>
        </PolicyList>
        <P>Please tell us promptly if you think your account has been used without your permission.</P>
      </>
    ),
  },
  {
    id: "intellectual-property",
    number: "09",
    title: "Intellectual Property",
    content: (
      <P>
        The content on this website, including text, logos, graphics and images, belongs to Trenza or its licensors and is
        protected by applicable intellectual property laws. You may not copy, reproduce or use it for commercial purposes
        without our written permission.
      </P>
    ),
  },
  {
    id: "limitation-of-liability",
    number: "10",
    title: "Limitation of Liability",
    content: (
      <P>
        To the extent permitted by applicable law, Trenza is not liable for indirect or consequential losses arising from
        your use of the website or products. Nothing in these Terms limits any liability that cannot be limited by law.
      </P>
    ),
  },
  {
    id: "changes-to-terms",
    number: "11",
    title: "Changes to Terms",
    content: (
      <P>
        We may update these Terms from time to time. The &ldquo;Last updated&rdquo; date at the top of the page shows the
        latest version, and continuing to use the website after a change means you accept the updated Terms.
      </P>
    ),
  },
  {
    id: "contact-us",
    number: "12",
    title: "Contact Us",
    content: (
      <P>
        Questions about these Terms? Reach us through our{" "}
        <Link href="/contact" className="text-[#454F45] underline underline-offset-4">
          Contact page
        </Link>
        {contactEmail && (
          <>
            {" "}
            or email{" "}
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