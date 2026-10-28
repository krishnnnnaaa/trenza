import Link from "next/link";
import type { ReactNode } from "react";

// Shared frame for verify-email / forgot-password / reset-password.
// If your login/signup already sit inside an auth layout with the wordmark, move the card part there instead.
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            aria-label="Trenza home"
            className="font-serif text-3xl uppercase tracking-[0.25em] text-[#17181A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-4"
          >
            Trenza
          </Link>
          <p className="mt-2 text-sm text-[#857F73]">Style that speaks for you.</p>
        </div>

        <div className="rounded-lg border border-[#E3DFD8] bg-[#FAF8F5] p-6 shadow-sm sm:p-8">
          {children}
        </div>
      </div>
    </main>
  );
}