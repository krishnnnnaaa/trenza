import { Heart, MapPin, Package, UserRound, type LucideIcon } from "lucide-react";

export type AccountNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** true = active only on the exact path (so /account doesn't light up for /account/addresses) */
  exact?: boolean;
};

// Single source of truth. New section = one new line here.
// Logout is an action (not a route), so it is rendered separately in the sidebar.
export const ACCOUNT_NAV: AccountNavItem[] = [
  { label: "Personal Information", href: "/account", icon: UserRound, exact: true },
  { label: "My Orders", href: "/orders", icon: Package },
  { label: "Manage Address", href: "/account/addresses", icon: MapPin },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
];