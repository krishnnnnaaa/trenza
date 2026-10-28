import { CONTACT_INFO } from "@/lib/constants/contactInfo";
import {
  CheckCircle2,
  CreditCard,
  MessageSquare,
  Smartphone,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";


export interface PrivacySection {
  id: string;
  number: string;
  title: string;
  content: ReactNode;
}

const P = ({ children }: { children: ReactNode }) => (
  <p className="text-sm leading-7 text-[#514B43]">{children}</p>
);

function InfoGroup({ icon: Icon, title, items }: { icon: LucideIcon; title: string; items: ReactNode[] }) {
  return (
    <div className="rounded-lg border border-[#E3DFD8] bg-[#FCFBF9] p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EDE9E2]">
          <Icon className="h-4 w-4 text-[#17181A]" strokeWidth={1.6} aria-hidden="true" />
        </span>
        <h3 className="text-sm font-medium text-[#17181A]">{title}</h3>
      </div>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-6 text-[#514B43] marker:text-[#A39D92]">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

const Check = ({ children }: { children: ReactNode }) => (
  <li className="flex items-start gap-2.5">
    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#454F45]" aria-hidden="true" />
    <span>{children}</span>
  </li>
);

const Provider = ({ title, children }: { title: string; children: ReactNode }) => (
  <li className="border-l-2 border-[#E3DFD8] pl-4">
    <p className="text-sm font-medium text-[#17181A]">{title}</p>
    <p className="mt-0.5 text-sm leading-6 text-[#514B43]">{children}</p>
  </li>
);

const contactEmail = CONTACT_INFO.email?.value;

export const PRIVACY_SECTIONS: PrivacySection[] = [
  {
    id: "introduction",
    number: "01",
    title: "Introduction",
    content: (
      <>
        <P>
          This Privacy Policy explains how Trenza (&ldquo;we&rdquo;, &ldquo;us&rdquo;) collects, uses and protects your
          personal information when you browse our store, create an account, place an order or contact us.
        </P>
        <P>
          By using Trenza you acknowledge the practices described here. If you do not agree with them, please do not use
          the website.
        </P>
      </>
    ),
  },
  {
    id: "information-we-collect",
    number: "02",
    title: "Information We Collect",
    content: (
      <>
        <P>We collect only the information needed to run the store. It falls into these groups:</P>
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoGroup
            icon={UserRound}
            title="Personal information"
            items={[
              "Name and email address you give when you sign up",
              "Your password, which is stored in hashed form rather than as plain text",
              "Items you save in your cart and wishlist",
            ]}
          />
          <InfoGroup
            icon={CreditCard}
            title="Order and payment information"
            items={[
              "Delivery details: recipient name, phone number, address, city, state, postal code and country",
              "Items ordered, order total, chosen payment method and payment status",
              "Online payments are processed by our payment provider; we do not store your card or bank details",
            ]}
          />
          <InfoGroup
            icon={Smartphone}
            title="Device and usage information"
            items={[
              "Session data that keeps you signed in",
              <>
                Technical data such as IP address, browser and device type
              </>,
            ]}
          />
          <InfoGroup
            icon={MessageSquare}
            title="Communications and support"
            items={[
              "Name, email, subject and message when you use our contact form",
              "Emails you send us and our replies",
            ]}
          />
        </div>
      </>
    ),
  },
  {
    id: "how-we-use-your-information",
    number: "03",
    title: "How We Use Your Information",
    content: (
      <>
        <P>We use your information to:</P>
        <ul className="grid gap-x-8 gap-y-3 text-sm leading-6 text-[#514B43] sm:grid-cols-2">
          <Check>Create and manage your account</Check>
          <Check>Process, deliver and keep track of your orders</Check>
          <Check>Take payments and confirm them</Check>
          <Check>Send account emails such as email verification and password reset</Check>
          <Check>Provide customer support and reply to your messages</Check>
          <Check>Keep accounts and the store secure</Check>
          <Check>
            Improve the shopping experience
          </Check>
          <Check>Meet legal and accounting obligations</Check>
        </ul>
      </>
    ),
  },
  {
    id: "sharing-of-information",
    number: "04",
    title: "Sharing of Information",
    content: (
      <>
        <P>
          We share information only where needed to run the store, with the categories of providers below.
        </P>
        <ul className="space-y-4">
          <Provider title="Payment processing">
            Our payment provider (Razorpay) receives the details needed to process online payments.
          </Provider>
          <Provider title="Email delivery">
            A service that sends our account and support emails receives your email address and name.
          </Provider>
          <Provider title="Hosting and database">
            Infrastructure providers store the data that powers your account and orders.
          </Provider>
          <Provider title="Delivery partners">
            Couriers receive your name, address and phone number so your order can reach you.
          </Provider>
          <Provider title="Legal requirements">
            We may disclose information if the law requires it or to protect our rights and users.
          </Provider>
        </ul>
      </>
    ),
  },
  {
    id: "cookies-and-tracking",
    number: "05",
    title: "Cookies and Tracking",
    content: (
      <>
        <P>
          We use cookies that are necessary to sign you in and keep your session secure. Your browser may also keep small
          pieces of data in local or session storage, for example to remember checkout progress while a payment is in
          progress.
        </P>
        <P>
          Our payment provider&rsquo;s checkout window may set its own cookies, governed by its own policy.
        </P>
        <P>
          We currently use analytics or advertising cookies: <strong>none</strong>.
        </P>
        <P>You can block or delete cookies in your browser settings, but parts of the store, such as signing in, may stop working.</P>
      </>
    ),
  },
  {
    id: "data-security",
    number: "06",
    title: "Data Security",
    content: (
      <>
        <P>
          We take reasonable technical and organisational measures to protect your information, including storing
          passwords in hashed form and leaving card handling to our payment provider.
        </P>
        <P>
          No method of transmission or storage is completely secure, so we cannot guarantee absolute security. Please use
          a strong, unique password and keep it private.
        </P>
      </>
    ),
  },
  {
    id: "your-rights",
    number: "07",
    title: "Your Rights",
    content: (
      <>
        <P>
          Depending on applicable law, you may have the right to access, correct or delete your personal information, and
          to object to or withdraw consent for certain uses.
        </P>
        <P>
          You can update your name and manage saved addresses yourself from{" "}
          <Link href="/account" className="text-[#454F45] underline underline-offset-4">
            My Account
          </Link>
          . For anything else, such as a copy of your data or deleting your account, contact us using the details below.
        </P>
      </>
    ),
  },
  {
    id: "data-retention",
    number: "08",
    title: "Data Retention",
    content: (
      <P>
        We keep your information for as long as needed to provide our services, meet legal and accounting obligations and
        resolve disputes. Specific retention periods: <strong>to be defined</strong>.
      </P>
    ),
  },
  {
    id: "childrens-privacy",
    number: "09",
    title: "Children's Privacy",
    content: (
      <P>
        Trenza is not directed at children, and we do not knowingly collect personal information from them. If you believe
        a child has given us information, please contact us so we can remove it.
      </P>
    ),
  },
  {
    id: "changes-to-this-policy",
    number: "10",
    title: "Changes to This Policy",
    content: (
      <P>
        We may update this policy from time to time. The &ldquo;Last updated&rdquo; date at the top of the page shows the
        latest version. If a change is significant, we will make it clear on the website.
      </P>
    ),
  },
  {
    id: "contact-us",
    number: "11",
    title: "Contact Us",
    content: (
      <P>
        Questions about this policy or how your data is handled? Reach us through our{" "}
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