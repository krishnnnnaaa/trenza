"use client";

import { Loader2, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { ACCOUNT_NAV, type AccountNavItem } from "@/lib/constants/accountNavItem";
import { useLogout } from "@/lib/useLogout";

// Mobile: horizontal scrollable pills. md+: vertical sidebar rows.
const itemClass = (active: boolean) =>
  cn(
    "flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2",
    "md:w-full md:rounded-md md:px-3.5 md:py-2.5",
    active
      ? "bg-[#454F45] text-white"
      : "bg-[#F0EDE7] text-[#17181A] hover:text-[#454F45] md:bg-transparent md:hover:bg-[#F0EDE7]",
  );

const isActive = (pathname: string, { href, exact }: AccountNavItem) =>
  exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

export function AccountSidebar() {
  const pathname = usePathname();
  const { logout, isLoggingOut } = useLogout();

  return (
    <nav
      aria-label="Account navigation"
      className={cn(
        "-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:-mx-6 sm:px-6 [&::-webkit-scrollbar]:hidden",
        "md:sticky md:top-24 md:mx-0 md:flex-col md:gap-1 md:self-start md:overflow-visible md:rounded-lg md:border md:border-[#E3DFD8] md:bg-[#FAF8F5] md:p-2",
      )}
    >
      {ACCOUNT_NAV.map((item) => {
        const active = isActive(pathname, item);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={itemClass(active)}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}

      <span aria-hidden="true" className="my-1 hidden border-t border-[#E3DFD8] md:block" />

      <button
        type="button"
        onClick={logout}
        disabled={isLoggingOut}
        aria-busy={isLoggingOut}
        className={cn(itemClass(false), "disabled:pointer-events-none disabled:opacity-60")}
      >
        {isLoggingOut ? (
          <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden="true" />
        ) : (
          <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
        )}
        Logout
      </button>
    </nav>
  );
}