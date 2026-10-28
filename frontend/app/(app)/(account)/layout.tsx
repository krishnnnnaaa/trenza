// app/(app)/(account)/layout.tsx
import type { ReactNode } from "react";

import { AccountHeader } from "@/components/account-page/AccountHeader";
import { AccountSidebar } from "@/components/account-page/AccountSidebar";

interface AccountLayoutProps {
  children: ReactNode;
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  return (
    <>
      <AccountHeader />
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:py-10 lg:py-12">
        <div className="grid gap-6 md:grid-cols-[220px_minmax(0,1fr)] md:gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10">
          <AccountSidebar />
          <section className="min-w-0">{children}</section>
        </div>
      </div>
    </>
  );
}