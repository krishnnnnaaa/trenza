"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface ResultsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void,
  /** How many page numbers to show on each side of the current page. */
  siblingCount?: number;
  className?: string;
}

type PageItem = number | "ellipsis-start" | "ellipsis-end";

function getPageItems(
  currentPage: number,
  totalPages: number,
  siblingCount: number,
): PageItem[] {
  // first + last + current + 2*siblings + 2 ellipsis slots
  const maxVisible = siblingCount * 2 + 5;

  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const left = Math.max(currentPage - siblingCount, 1);
  const right = Math.min(currentPage + siblingCount, totalPages);
  const showStartEllipsis = left > 2;
  const showEndEllipsis = right < totalPages - 1;

  const items: PageItem[] = [];

  if (!showStartEllipsis) {
    for (let i = 1; i < left; i++) items.push(i);
  } else {
    items.push(1, "ellipsis-start");
  }

  for (let i = left; i <= right; i++) items.push(i);

  if (!showEndEllipsis) {
    for (let i = right + 1; i <= totalPages; i++) items.push(i);
  } else {
    items.push("ellipsis-end", totalPages);
  }

  return items;
}

const baseButton =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-sm px-3 text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40";

export function ResultsPagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
}: ResultsPaginationProps) {
  if (totalPages <= 1) return null;

  const items = getPageItems(currentPage, totalPages, siblingCount);

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-1", className)}
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous page"
        className={cn(
          baseButton,
          "border border-[#E3DFD8] text-[#17181A] hover:bg-[#F0EDE7] hover:text-[#454F45]",
        )}
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </button>

      <ul className="flex items-center gap-1" role="list">
        {items.map((item) => {
          if (typeof item !== "number") {
            return (
              <li
                key={item}
                aria-hidden="true"
                className="flex h-9 min-w-9 items-center justify-center text-sm text-[#857F73]"
              >
                &hellip;
              </li>
            );
          }

          const isActive = item === currentPage;

          return (
            <li key={item}>
              <button
                type="button"
                onClick={() => onPageChange(item)}
                aria-label={`Page ${item}`}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  baseButton,
                  isActive
                    ? "bg-[#17181A] font-medium text-white"
                    : "text-[#17181A] hover:bg-[#F0EDE7] hover:text-[#454F45]",
                )}
              >
                {item}
              </button>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
        className={cn(
          baseButton,
          "border border-[#E3DFD8] text-[#17181A] hover:bg-[#F0EDE7] hover:text-[#454F45]",
        )}
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </nav>
  );
}