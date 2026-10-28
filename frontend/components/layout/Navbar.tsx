"use client";

import {
  ChevronRight,
  Heart,
  Home,
  Menu,
  Search,
  ShoppingBag,
  Sparkles,
  User,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useShop } from "@/app/context/ShopContent";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/categories" },
  { label: "New Arrivals", href: "/shop?sort=newest" },
] as const;

const MOBILE_LINKS = [
  { ...NAV_LINKS[0], icon: Home },
  { ...NAV_LINKS[1], icon: ShoppingBag },
  { ...NAV_LINKS[2], icon: Sparkles },
  { ...NAV_LINKS[3], icon: Sparkles },
] as const;

const PERSONAL_LINKS = [
  { label: "Wishlist", href: "/wishlist", icon: Heart },
  { label: "Account", href: "/account", icon: User },
] as const;

function IconButton({
  href,
  label,
  children,
  badge,
}: {
  href: string;
  label: string;
  children: ReactNode;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-sm text-[#17181A] hover:bg-[#F0EDE7] hover:text-[#454F45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45]"
    >
      {children}
      {typeof badge === "number" && badge > 0 && (
        <span
          className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#17181A] px-1 text-[10px] font-medium leading-none text-white"
          aria-hidden="true"
        >
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </Link>
  );
}

export function Navbar() {
  const { cartCount, wishlistCount } = useShop();
  const { data: session, isPending } = authClient.useSession();
  const isAuthenticated = isPending || !!session?.user;

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-[#E3DFD8] bg-[#FAF8F5]">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-10">
        {/* Logo */}
        <Link
          href="/"
          className="font-serif text-xl tracking-tight text-[#17181A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
        >
          <Image src="/logo.png" alt="Trenza" width={140} height={140} />
        </Link>

        {/* Desktop nav links */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-10 md:flex"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[#17181A] transition-colors duration-150 hover:text-[#454F45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop icon actions */}
        <div className="hidden items-center gap-1 md:flex">
          <IconButton href="/shop" label="Search">
            <Search className="h-4.5 w-4.5" aria-hidden="true" />
          </IconButton>
          <IconButton href="/wishlist" label="Wishlist" badge={wishlistCount}>
            <Heart className="h-4.5 w-4.5" aria-hidden="true" />
          </IconButton>
          <IconButton href="/cart" label="Cart" badge={cartCount}>
            <ShoppingBag className="h-4.5 w-4.5" aria-hidden="true" />
          </IconButton>
          {isAuthenticated ? (
            <IconButton href="/account" label="Account">
              <User className="h-4.5 w-4.5" aria-hidden="true" />
            </IconButton>
          ) : (
            <Link
              href="/login"
              className="inline-flex h-9 items-center justify-center rounded-sm bg-[#17181A] px-4 text-sm font-medium text-white transition-colors hover:bg-[#454F45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
            >
              Log in
            </Link>
          )}
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-1 md:hidden">
          <IconButton href="/shop" label="Search">
            <Search className="h-4.5 w-4.5" aria-hidden="true" />
          </IconButton>
          <IconButton href="/cart" label="Cart" badge={cartCount}>
            <ShoppingBag className="h-4.5 w-4.5" aria-hidden="true" />
          </IconButton>

          <Sheet>
            <SheetTrigger
              aria-label="Open menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-sm text-[#17181A] hover:bg-[#F0EDE7] hover:text-[#454F45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45]"
            >
              <Menu className="h-4.5 w-4.5" aria-hidden="true" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[min(88vw,380px)] border-l border-[#E3DFD8] bg-[#FAF8F5] p-0 text-[#17181A] sm:w-[380px]"
            >
              <div className="flex h-full flex-col overflow-y-auto">
                <SheetHeader className="border-b border-[#E3DFD8] px-6 pb-6 pt-7 pr-16">
                  <Link
                    href="/"
                    className="mb-5 w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
                  >
                    <Image
                      src="/logo.png"
                      alt="Trenza"
                      width={112}
                      height={112}
                      className="h-auto w-28"
                    />
                  </Link>
                  <SheetTitle className="font-serif text-2xl font-normal tracking-tight text-[#17181A]">
                    Find your next favorite.
                  </SheetTitle>
                  <SheetDescription className="text-sm leading-relaxed text-[#857F73]">
                    Thoughtfully designed essentials for the way you live.
                  </SheetDescription>
                </SheetHeader>

                <nav
                  aria-label="Mobile navigation"
                  className="flex flex-1 flex-col px-4 py-6"
                >
                  <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#857F73]">
                    Explore
                  </p>
                  <div className="mt-3 flex flex-col gap-1">
                    {MOBILE_LINKS.map((link, index) => {
                      const Icon = link.icon;

                      return (
                        <SheetClose key={link.href}>
                          <Link
                            href={link.href}
                            className={cn(
                              "group flex items-center gap-3 rounded-lg px-3 py-3.5 text-[15px] font-medium text-[#17181A] transition-colors duration-150 hover:bg-[#F0EDE7] hover:text-[#454F45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45]",
                              index === 3 &&
                                "border-t border-[#E3DFD8] mt-2 pt-5"
                            )}
                          >
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F0EDE7] text-[#454F45] transition-colors group-hover:bg-[#454F45] group-hover:text-white">
                              <Icon className="h-4 w-4" aria-hidden="true" />
                            </span>
                            <span className="flex-1 text-left">{link.label}</span>
                            <ChevronRight
                              className="h-4 w-4 text-[#B8B3AA] transition-transform group-hover:translate-x-0.5 group-hover:text-[#454F45]"
                              aria-hidden="true"
                            />
                          </Link>
                        </SheetClose>
                      );
                    })}
                  </div>

                  <p className="mt-8 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#857F73]">
                    Your space
                  </p>
                  <div className="mt-3 flex flex-col gap-1">
                    {(isAuthenticated
                      ? PERSONAL_LINKS
                      : [{ label: "Log in", href: "/login", icon: User }]
                    ).map((link) => {
                      const Icon = link.icon;
                      const count =
                        link.href === "/wishlist"
                          ? wishlistCount
                          : undefined;

                      return (
                        <SheetClose key={link.href}>
                          <Link
                            href={link.href}
                            className="group flex items-center gap-3 rounded-lg px-3 py-3.5 text-[15px] font-medium text-[#17181A] transition-colors duration-150 hover:bg-[#F0EDE7] hover:text-[#454F45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45]"
                          >
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F0EDE7] text-[#454F45] transition-colors group-hover:bg-[#454F45] group-hover:text-white">
                              <Icon className="h-4 w-4" aria-hidden="true" />
                            </span>
                            <span className="flex-1 text-left">{link.label}</span>
                            {typeof count === "number" && count > 0 && (
                              <span className="rounded-full bg-[#454F45] px-2 py-0.5 text-xs font-medium text-white">
                                {count > 9 ? "9+" : count}
                              </span>
                            )}
                            <ChevronRight
                              className="h-4 w-4 text-[#B8B3AA] transition-transform group-hover:translate-x-0.5 group-hover:text-[#454F45]"
                              aria-hidden="true"
                            />
                          </Link>
                        </SheetClose>
                      );
                    })}
                  </div>
                </nav>

                <div className="mx-6 mb-6 rounded-xl bg-[#454F45] px-5 py-4 text-white">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-[#DCE4D9]">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                    Latest from Trenza
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-white/85">
                    Fresh arrivals, considered for your everyday.
                  </p>
                  <SheetClose>
                    <Link
                      href="/shop?sort=newest"
                      className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      Shop new arrivals
                      <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}