"use client";

import { getCategories } from "@/lib/api/category";
import { categoryTileColors } from "@/lib/constants/categoryTileColor";
import { CategoryApiResponse } from "@/types/types";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { Spinner } from "../ui/spinner";

const CategoryTiles = () => {
  const [categories, setCategories] =
    useState<CategoryApiResponse | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      const response = await getCategories('api/categories?limit=0');
      setCategories(response);
    }

    fetchCategories();
  }, []);

  const getCategoryColor = (id: number): string =>
    categoryTileColors[(id - 1) % categoryTileColors.length];

  return (
    <div className="w-full">
      {categories?.data ? (
        <div className="grid w-full grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {categories.data.map((item) => (
            <Link
              key={item.id}
              href={`/shop?category=${item.slug}`}
              aria-label={`Explore ${item.name}`}
              style={{
                backgroundColor: getCategoryColor(item.id),
              }}
              className="
              group relative min-h-42.5 overflow-hidden rounded-xl p-4
  sm:min-h-52.5 sm:p-6 transition-all duration-300
                hover:-translate-y-0.5 hover:shadow-sm
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#454F45]
                focus-visible:ring-offset-2
              "
            >
              {/* Decorative circle */}
              <div
                className="
                  absolute -bottom-20 -right-12
                  h-48 w-48 rounded-full
                  bg-white/25
                  transition-transform duration-500 ease-out
                  group-hover:scale-110
                "
              />

              {/* Secondary decorative circle */}
              <div
                className="
                  absolute -bottom-28 -right-24
                  h-56 w-56 rounded-full
                  border border-black/[0.035]
                  transition-transform duration-700 ease-out
                  group-hover:translate-x-3 group-hover:translate-y-2
                "
              />

              {/* Giant category initial */}
              <span
                aria-hidden="true"
                className="
                  absolute right-4 -top-5
                  select-none font-serif
                  text-[9rem] leading-none
                  text-black/5.5
                  transition-transform duration-500 ease-out
                  group-hover:-translate-y-1 group-hover:translate-x-1
                "
              >
                {item.name.charAt(0).toUpperCase()}
              </span>

              {/* Content */}
              <div className="relative z-10 flex h-full flex-col">
                <div>
                  <h3 className="font-serif text-sm sm:text-2xl font-normal tracking-tight text-[#17181A]">
                    {item.name}
                  </h3>

                  <p className="mt-1.5 text-sm text-[#857F73]">
                    {item.totalProducts}{" "}
                    {Number(item.totalProducts) === 1 ? "product" : "products"}
                  </p>
                </div>

                {/* Arrow */}
                <div className="mt-auto">
                  <span
                    className="
                      flex h-10 w-10 items-center mt-4 justify-center
                      rounded-full bg-white/75
                      text-[#17181A]
                      backdrop-blur-sm
                      transition-all duration-300
                      group-hover:bg-white
                      group-hover:translate-x-1
                    "
                  >
                    <ArrowUpRight
                      className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="col-span-full flex h-75 w-full items-center justify-center">
  <Spinner className="h-8 w-8" />
</div>
      )}
    </div>
  );
};

export default CategoryTiles;