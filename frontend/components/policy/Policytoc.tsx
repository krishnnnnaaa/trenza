"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";

import { cn } from "@/lib/utils";

export interface TocItem {
  id: string;
  number: string;
  title: string;
}

export function PolicyToc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const [open, setOpen] = useState(false); // mobile collapse only

  // highlight the section near the top of the viewport (no dependency)
  useEffect(() => {
    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  function handleClick(event: MouseEvent<HTMLAnchorElement>, id: string) {
    const target = document.getElementById(id);
    if (!target) return; // fall back to the normal anchor jump
    event.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
    setActiveId(id);
    setOpen(false);
  }

  return (
    <nav
      aria-label="On this page"
      className="rounded-lg border border-[#E3DFD8] bg-[#FCFBF9] p-4 lg:sticky lg:top-24 lg:self-start lg:p-5"
    >
      <p className="hidden font-serif text-lg text-[#17181A] lg:block">On this page</p>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="policy-toc-list"
        className="flex w-full items-center justify-between font-serif text-lg text-[#17181A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] lg:hidden"
      >
        On this page
        <ChevronDown className={cn("h-4 w-4 text-[#857F73] transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>

      <ol id="policy-toc-list" className={cn("mt-3 flex-col gap-0.5 lg:flex", open ? "flex" : "hidden")}>
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                aria-current={active ? "location" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-r-md border-l-2 px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45]",
                  active
                    ? "border-[#454F45] bg-[#EDEAE2] font-medium text-[#17181A]"
                    : "border-transparent text-[#514B43] hover:bg-[#F0EDE7] hover:text-[#17181A]",
                )}
              >
                <span className={cn("text-xs tabular-nums", active ? "text-[#454F45]" : "text-[#A39D92]")}>
                  {item.number}
                </span>
                {item.title}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}