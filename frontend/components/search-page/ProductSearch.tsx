"use client";

import React, { useEffect, useState } from "react";

import Filters from "./Filters";
import SearchResult from "./SearchResult";

import { Pagination, ProductApiResponse } from "@/types/types";
import { useRouter, useSearchParams } from "next/navigation";
import { getProduct } from "@/lib/api/products";

const ProductSearch = () => {
  const router = useRouter();
  const params = useSearchParams();
  const queryString = params.toString();
  const [openToggle, setOpenToggle] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState<"newest" | "low-to-high" | "high-to-low">("newest");
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [results, setResults] = useState<ProductApiResponse | null>(null);
  const [searchQeuryState, setSearchQeuryState] = useState<"blank" | "notfound" | "loading" | "ready">("blank");
  const search = params.get("t");
  const category = params.get("category");
  const minPrice = params.get("minPrice");
  const maxPrice = params.get("maxPrice");
  const page = params.get("page");

  function onPageChange(page: number){
    const newParam = new URLSearchParams(params.toString());

    newParam.set("page", String(page));

    router.replace(`/shop?${newParam.toString()}`)
  }

  async function fetchProduct(endpoint: string) {
    return await getProduct(endpoint);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setSearchQeuryState("loading");
        const queries = new URLSearchParams();

        if (search) {
          queries.set("search", search);
        }
        if (category) {
          queries.set("category", category);
        }
        if (minPrice) {
          queries.set("minPrice", minPrice);
        }
        if (maxPrice) {
          queries.set("maxPrice", maxPrice);
        }
        if(sort === 'low-to-high'){
          queries.set("sort", "price_asc")
        }
        if(sort === 'high-to-low'){
          queries.set("sort", "price_desc")
        }
        if(sort === 'newest'){
          queries.set("sort", "newest")
        }
        if(page){
          queries.set("page", String(page))
        }
        const endpoint = `api/products?${queries.toString()}`;

        const response = await fetchProduct(endpoint)

        if (!response) {
          setSearchQeuryState("notfound");
          setResults(null);
          setPagination(null);
          return;
        }

        setResults(response);
        setPagination(response.pagination);

        // Check API response data
        if (response.data.length === 0) {
          setSearchQeuryState("notfound");
        } else {
          setSearchQeuryState("ready");
        }
      } catch (error) {
        console.error("Product search error:", error);

        setSearchQeuryState("notfound");
        setResults(null);
        setPagination(null);
      }
    };

    fetchData();
  }, [category, maxPrice, minPrice, page, queryString, search, sort]);
  

  return (
    <div className="mx-auto xl:flex-row flex-col xl:px-0 px-4 flex w-full max-w-7xl gap-6">
      {/* Filters */}
      <div className="w-70 shrink-0">
        <Filters openToggle={openToggle} setOpenToggle={setOpenToggle} />
      </div>

      {/* Products */}
      <div className="min-w-0 flex-1">
        <SearchResult
          view={view}
          openToggle={openToggle}
          setOpenToggle={setOpenToggle}
          sort={sort}
          products={results as ProductApiResponse}
          pagination={pagination as Pagination}
          searchQueryState={searchQeuryState}
          onViewChange={setView}
          onSortChange={setSort}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default ProductSearch;
