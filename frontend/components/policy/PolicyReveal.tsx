import type { ReactNode } from "react";

interface PolicyRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function PolicyReveal({ children, className = "" }: PolicyRevealProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
