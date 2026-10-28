import CategoryTiles from "@/components/category-page/CategoryTiles";
import React from "react";
import { fraunces } from "@/fonts/fonts";

export default async function CategoriesPage() {
  return (
    <main className="min-h-screen w-full bg-[#FAF8F5]">
      <div
        className={`
          mx-auto w-full max-w-7xl
          px-4 py-10
          sm:px-6 sm:py-12
          lg:px-8 lg:py-16
          ${fraunces.variable}
        `}
      >
        {/* Header */}
        <header className="max-w-2xl">
          <span className="text-xs font-medium tracking-[0.18em] text-[#857F73] sm:text-sm">
            CATEGORIES
          </span>

          <h1
            className="mt-3 text-4xl leading-tight tracking-tight text-[#17181A] sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Shop By Category
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-[#857F73] sm:text-base sm:leading-7">
            Explore our wide range of categories and find exactly what you
            need. From the latest tech to home essentials, we have got you
            covered.
          </p>
        </header>

        {/* Categories */}
        <section className="mt-10 sm:mt-12 lg:mt-14">
          <CategoryTiles />
        </section>
      </div>
    </main>
  );
}