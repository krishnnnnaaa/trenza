"use client";

import { useEffect, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";
import { getCategories } from "@/lib/api/category";
import type { CategoryApiResponse, FiltersProps } from "@/types/types";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

const FilterTile = ({
  title,
  children,
  defaultOpen = true,
  className,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  return (
    <div
      className={`border-b border-[#E3DFD8]  p-4 last:border-b-0 ${className || ""}`}
    >
      <Accordion
        multiple
        defaultValue={defaultOpen ? [title] : []}
        className="border-black/10 rounded-md py-2"
      >
        <AccordionItem value={title} className="border-none p-2">
          <AccordionTrigger className="py-0 text-sm font-medium text-[#17181A] hover:no-underline">
            {title}
          </AccordionTrigger>

          <AccordionContent className="pt-4 pb-1">{children}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

const Filters = ({openToggle, setOpenToggle}:FiltersProps) => {
  const params = useSearchParams();
  const router = useRouter();
  const [category, setCategory] = useState<CategoryApiResponse | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(params.get("minPrice")) || 0,
    Number(params.get("maxPrice")) || 5000,
  ]);

  const categoryParam = params.get("category");
  const minPriceParam = params.get("minPrice");
  const maxPriceParam = params.get("maxPrice");
  const queryString = params.toString();
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getCategories();

        if (response?.data?.length > 0) {
          setCategory(response);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    void loadCategories();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const newParams = new URLSearchParams(queryString);
      const [min, max] = priceRange;
      const currentMin = Number(minPriceParam) || 0;
      const currentMax = Number(maxPriceParam) || 5000;
      const priceRangeChanged = min !== currentMin || max !== currentMax;

      if (min > 0) {
        newParams.set("minPrice", String(min));
      } else {
        newParams.delete("minPrice");
      }

      if (max < 5000) {
        newParams.set("maxPrice", String(max));
      } else {
        newParams.delete("maxPrice");
      }

      if (priceRangeChanged) {
        newParams.delete("page");
      }

      const nextQueryString = newParams.toString();

      if (nextQueryString !== queryString) {
        router.replace(nextQueryString ? `/shop?${nextQueryString}` : "/shop");
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [
    maxPriceParam,
    minPriceParam,
    priceRange,
    queryString,
    router,
  ]);

  return (
     <>
    {/* Mobile backdrop */}
    <div
      aria-hidden="true"
      onClick={() => setOpenToggle?.(false)}
      className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 xl:hidden ${
        openToggle
          ? "visible opacity-100"
          : "invisible pointer-events-none opacity-0"
      }`}
    />
    <section
      aria-label="Product filters"
    className={`
  fixed inset-y-0 left-0 z-50
  flex h-dvh w-[min(85vw,320px)] flex-col gap-4
  overflow-y-auto border-r border-[#E3DFD8]
  bg-[#FAF9F6] px-4 py-6 shadow-xl
  transition-transform duration-300 ease-in-out
  ${openToggle ? "translate-x-0" : "-translate-x-full"}
  xl:sticky xl:top-20 xl:z-auto xl:h-[calc(100vh-5rem)]
  xl:w-full xl:translate-x-0 xl:shadow-none
  xl:transition-none
`}
    >
      {/* Drawer header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-[#17181A] xl:hidden">
          Filters
        </h2>

        <button
          type="button"
          aria-label="Close filters"
          onClick={() => setOpenToggle?.(false)}
          className="rounded-md p-2 hover:bg-black/5 xl:hidden"
        >
          <X className="size-5" />
        </button>
      </div>
      <div className="space-y-3 xl:hidden border-b border-[#E3DFD8] pb-4">
        <div>
          <span className="text-sm text-[#17181A]">Categories</span>
        </div>
        {category?.data.map((categoryItem) => (
          <Field
            orientation="horizontal"
            key={categoryItem.id}
            className="items-center"
          >
            <Checkbox
              id={`category-${categoryItem.id}`}
              name="category"
              value={categoryItem.slug}
              checked={categoryParam === categoryItem.slug}
              onCheckedChange={(checked) => {
                const newParams = new URLSearchParams(params.toString());
                if (checked) {
                  newParams.set("category", categoryItem.slug);
                } else {
                  newParams.delete("category");
                }
                router.replace(`/shop?${newParams.toString()}`);
              }}
            />

            <FieldLabel
              htmlFor={`category-${categoryItem.id}`}
              className="cursor-pointer text-sm font-normal text-[#857F73]"
            >
              {categoryItem.name}
            </FieldLabel>
          </Field>
        ))}
      </div>
      <div className="space-y-3 xl:hidden">
        <div>
          <span className="text-sm text-[#17181A]">Price Range</span>
        </div>
        <Slider
          value={priceRange}
          onValueChange={(value) => {
            if (!Array.isArray(value) || value.length < 2) return;
            setPriceRange([value[0], value[1]]);
          }}
          min={0}
          max={5000}
          step={5}
          className="w-full"
        />

        <div className="flex items-center justify-between">
          <span className="text-sm text-[#857F73]">
            ₹{Number(minPriceParam) || 0}
          </span>

          <span className="text-sm text-[#857F73]">
            ₹{Number(maxPriceParam) || 5000}
          </span>
        </div>
      </div>
      {/* Categories */}
      <FilterTile className="xl:block hidden" title="Categories">
        <div className="space-y-3">
          {category?.data.map((categoryItem) => (
            <Field
              orientation="horizontal"
              key={categoryItem.id}
              className="items-center"
            >
              <Checkbox
                id={`category-${categoryItem.id}`}
                name="category"
                value={categoryItem.slug}
                checked={categoryParam === categoryItem.slug}
                onCheckedChange={(checked) => {
                  const newParams = new URLSearchParams(params.toString());
                  if (checked) {
                    newParams.set("category", categoryItem.slug);
                  } else {
                    newParams.delete("category");
                  }
                  router.replace(`/shop?${newParams.toString()}`);
                }}
              />

              <FieldLabel
                htmlFor={`category-${categoryItem.id}`}
                className="cursor-pointer text-sm font-normal text-[#857F73]"
              >
                {categoryItem.name}
              </FieldLabel>
            </Field>
          ))}
        </div>
      </FilterTile>

      {/* Price Range */}
      <FilterTile className="xl:block hidden" title="Price Range">
        <div className="space-y-3">
          <Slider
            value={priceRange}
            onValueChange={(value) => {
              if (!Array.isArray(value) || value.length < 2) return;
              setPriceRange([value[0], value[1]]);
            }}
            min={0}
            max={5000}
            step={5}
            className="w-full"
          />

          <div className="flex items-center justify-between">
            <span className="text-sm text-[#857F73]">
              ₹{Number(minPriceParam) || 0}
            </span>

            <span className="text-sm text-[#857F73]">
              ₹{Number(maxPriceParam) || 5000}
            </span>
          </div>
        </div>
      </FilterTile>
    </section>
    </>
  );
};

export default Filters;
