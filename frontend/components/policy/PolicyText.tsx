import { CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";

export const P = ({ children }: { children: ReactNode }) => (
  <p className="text-sm leading-7 text-[#514B43]">{children}</p>
);

export const PolicyList = ({ children }: { children: ReactNode }) => (
  <ul className="list-disc space-y-1.5 pl-5 text-sm leading-7 text-[#514B43] marker:text-[#A39D92]">{children}</ul>
);

export const CheckItem = ({ children }: { children: ReactNode }) => (
  <li className="flex items-start gap-2.5">
    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#454F45]" aria-hidden="true" />
    <span>{children}</span>
  </li>
);