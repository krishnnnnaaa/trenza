import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}

const linkGroups: FooterLinkGroup[] = [
  {
    title: "Shop",
    links: [
      { label: "New Arrivals", href: "/shop?sort=newest" },
      { label: "All Products", href: "/shop" },
      { label: "Categories", href: "/categories" },
      { label: "Trending", href: "#trending" },
      { label: "Best Sellers", href: "#featured" },
    ],
  },
  {
    title: "Customer",
    links: [
      { label: "My Account", href: "/account" },
      { label: "Wishlist", href: "/wishlist" },
      { label: "Cart", href: "/cart" },
      { label: "Orders", href: "/account/orders" },
      { label: "Addresses", href: "/account/addresses" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Shipping & Delivery", href: "/shipping-and-delivery" },
      { label: "Returns & Refunds", href: "/returns-and-refunds" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
  },
];

const socialLinks: { label: string; href: string; icon: ReactNode }[] = [
  { label: "Instagram", href: "https://instagram.com", icon: <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Instagram</title><path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/></svg> },
  { label: "Twitter", href: "https://twitter.com", icon: <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>X</title><path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z"/></svg> },
  { label: "Facebook", href: "https://facebook.com", icon: <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Facebook</title><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"/></svg> },
];

export function Footer() {
  return (
    <footer className="border-t border-[#E3DFD8] bg-[#FAF8F5]">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-4">
            <Link
              href="/"
              className="font-serif text-xl tracking-tight text-[#17181A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
            >
                <Image src="/logo.png" alt="Trenza" width={180} height={180} />
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#857F73]">
              Thoughtfully designed essentials for the way you live.
            </p>
          </div>

          {/* Link groups */}
          <div className="grid grid-cols-2 gap-8 sm:col-span-2 lg:col-span-5 lg:grid-cols-3">
            {linkGroups.map((group) => (
              <nav
                key={group.title}
                aria-label={group.title}
                className={
                  group.title === "Help" ? "col-span-2 sm:col-span-1" : ""
                }
              >
                <h3 className="text-sm font-medium text-[#17181A]">
                  {group.title}
                </h3>
                <ul className="mt-4 flex flex-col gap-3" role="list">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-[#857F73] transition-colors duration-150 hover:text-[#454F45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          {/* Stay connected */}
          <div className="sm:col-span-2 lg:col-span-3">
            <h3 className="text-sm font-medium text-[#17181A]">
              Stay connected
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#857F73]">
              Follow along for new arrivals and behind-the-scenes.
            </p>

            <ul className="mt-4 flex items-center gap-2" role="list">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Trenza on ${social.label}`}
                    className="flex h-9 w-9 items-center justify-center rounded-sm text-[#17181A] transition-colors duration-150 hover:bg-[#F0EDE7] hover:text-[#454F45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:fill-current"
                  >
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#E3DFD8]">
        <div className="mx-auto flex max-w-7xl flex-col-reverse items-center gap-2 px-6 py-6 text-xs text-[#857F73] sm:flex-row sm:justify-between lg:px-10">
          <p>&copy; 2026 Trenza. All rights reserved.</p>
          <p className="text-[#B8B3AA]">Made with ❤️. Give thanks to T.</p>
        </div>
      </div>
    </footer>
  );
}