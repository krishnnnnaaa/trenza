'use client'
import React from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LayoutGrid, List, ListFilter } from 'lucide-react';
import { Pagination } from '@/types/types';
import { useRouter, useSearchParams } from 'next/navigation';

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low-to-High", value: "low-to-high" },
  { label: "Price: High-to-Low", value: "high-to-low" },
];

const ResultsToolbar = ({view, setView, pagination, onSortChange, openToggle, setOpenToggle}: {view: "grid" | "list", setView: React.Dispatch<React.SetStateAction<"grid" | "list">>, pagination: Pagination, onSortChange: React.Dispatch<React.SetStateAction<"newest" | "low-to-high" | "high-to-low">>, openToggle?: boolean, setOpenToggle?: React.Dispatch<React.SetStateAction<boolean>>}) => {
    const params=  useSearchParams()
    const router = useRouter()
    const sortParam = params.get("sort");

  const handleSort = (val: "newest" | "low-to-high" | "high-to-low")=>{

    if(!val) return;
    const newParams = new URLSearchParams(params.toString())
    if(val === 'low-to-high'){
      newParams.set("sort", "price_asc")
    } else if(val === 'high-to-low'){
      newParams.set("sort", "price_desc")
    }else if(val === 'newest'){
      newParams.set("sort", "newest")
    }else{
      newParams.delete("sort");
    }
    onSortChange(val as "newest" | "low-to-high" | "high-to-low")
    router.replace(`/shop?${newParams.toString()}`);
  }

const selectedSort =
  sortParam === "price_asc"
    ? "low-to-high"
    : sortParam === "price_desc"
      ? "high-to-low"
      : "newest";

return (
  <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
    {/* Product count */}
    <span className="order-3 text-sm text-[#857F73] xl:order-1">
      Page {pagination.page} of {pagination.totalPages} ·{" "}
      {pagination.total} products
    </span>

    <div className="order-1 flex w-full flex-col gap-3 xl:order-2 xl:w-auto xl:flex-row xl:items-center">
      {/* Sort + Filter */}
      <div className="flex w-full items-center border-y border-black/10 xl:w-auto xl:border-0">
        {/* Sort */}
        <div className="flex flex-1 items-center justify-center border-r border-black/10 xl:flex-none xl:justify-start xl:gap-2 xl:border-0">
          <span className="hidden text-sm text-[#17181A] xl:block">
            Sort by
          </span>

          <Select
            value={selectedSort}
            onValueChange={(val) => {
              if (
                val === "newest" ||
                val === "low-to-high" ||
                val === "high-to-low"
              ) {
                handleSort(val);
              }
            }}
          >
            <SelectTrigger className="h-11 w-60 justify-center rounded-none border-0 shadow-none focus:ring-0 xl:h-10 xl:w-44 xl:justify-between xl:rounded-md xl:border xl:border-black/10 ">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>

            <SelectContent alignItemWithTrigger={false}>
              <SelectGroup>
                {sortOptions.map((item) => (
                  <SelectItem
                    key={item.value}
                    value={item.value}
                    label={item.label}
                  >
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Filter — mobile only */}
        <button
          type="button"
          aria-label="Open filters"
          aria-expanded={!!openToggle}
          onClick={() => setOpenToggle?.(true)}
          className="flex h-11 flex-1 items-center justify-center gap-2 text-sm font-medium text-[#17181A] xl:hidden"
        >
          <ListFilter className="size-4" />
          Filter
        </button>
      </div>

      {/* Grid / List — below Sort + Filter on mobile */}
      <div className="flex justify-end xl:justify-start">
        <div className="flex items-center overflow-hidden rounded-md border border-black/10">
          <button
            type="button"
            aria-label="Grid view"
            aria-pressed={view === "grid"}
            onClick={() => setView("grid")}
            className={`flex h-10 w-10 items-center justify-center transition-colors ${
              view === "grid"
                ? "bg-[#F0EDE7] text-[#17181A]"
                : "text-[#857F73] hover:bg-[#F0EDE7]"
            }`}
          >
            <LayoutGrid className="size-4" />
          </button>

          <button
            type="button"
            aria-label="List view"
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
            className={`flex h-10 w-10 items-center justify-center border-l border-black/10 transition-colors ${
              view === "list"
                ? "bg-[#F0EDE7] text-[#17181A]"
                : "text-[#857F73] hover:bg-[#F0EDE7]"
            }`}
          >
            <List className="size-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
);
}

export default ResultsToolbar
