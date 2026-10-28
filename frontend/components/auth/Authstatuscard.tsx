import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Tone = "success" | "error" | "neutral";

const TONE_CLASS: Record<Tone, string> = {
  success: "bg-[#EEF4EF] text-[#3F6B4F]",
  error: "bg-[#FAEFEE] text-[#843B36]",
  neutral: "bg-[#F0EDE7] text-[#454F45]",
};

interface AuthStatusCardProps {
  icon: LucideIcon;
  tone?: Tone;
  iconClassName?: string;
  title: string;
  description: ReactNode;
  children?: ReactNode; // actions
}

export function AuthStatusCard({
  icon: Icon,
  tone = "neutral",
  iconClassName,
  title,
  description,
  children,
}: AuthStatusCardProps) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className="flex flex-col items-center text-center"
    >
      <span className={cn("flex h-14 w-14 items-center justify-center rounded-full", TONE_CLASS[tone])}>
        <Icon className={cn("h-6 w-6", iconClassName)} strokeWidth={1.8} aria-hidden="true" />
      </span>
      <h1 className="mt-5 font-serif text-2xl font-normal text-[#17181A] sm:text-3xl">{title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-[#857F73]">{description}</p>
      {children && <div className="mt-7 flex w-full flex-col gap-3">{children}</div>}
    </div>
  );
}

const LINK_BASE =
  "inline-flex h-11 w-full items-center justify-center rounded-sm px-6 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2";

export function AuthLinkButton({
  href,
  variant = "primary",
  children,
}: {
  href: string;
  variant?: "primary" | "secondary";
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        LINK_BASE,
        variant === "primary"
          ? "bg-[#17181A] text-white hover:bg-[#454F45]"
          : "border border-[#E3DFD8] bg-transparent text-[#17181A] hover:bg-[#F0EDE7]",
      )}
    >
      {children}
    </Link>
  );
}