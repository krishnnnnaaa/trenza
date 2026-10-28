"use client"
import { SearchResultType } from '@/types/types'
import { Search } from 'lucide-react'
import Link from 'next/link'
import ResultsToolbar from './ResultsToolbar'
import { ProductNotFound } from '../product/ProductNotFound'
import { ProductCard } from '@/components/HomePage/Product/Product'
import { ProductListItem } from '@/components/search-page/ProductListItem'
import { ProductResultsSkeleton } from '@/components/product/Productresultsskeleton'
import type { ProductWithImages } from '@/types/types'
import { ResultsPagination } from './ResultsPagination'
import { useWishlist } from '@/lib/UseWishlist'

const SearchResult = ({
  onPageChange,
  onSortChange,
  searchQueryState,
  onViewChange,
  pagination,
  products,
  openToggle,
  setOpenToggle,
  view,
}: SearchResultType) => {
  const {isWishlisted, toggle} = useWishlist()
  
  // No query in the URL yet — encourage the user to search or browse.
  if (searchQueryState === 'blank') {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-24 text-center sm:py-32">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F0EDE7]">
          <Search
            className="h-6 w-6 text-[#454F45]"
            aria-hidden="true"
            strokeWidth={1.75}
          />
        </span>
        <h2 className="mt-6 font-serif text-2xl font-normal text-[#17181A] sm:text-3xl">
          Search Trenza
        </h2>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#857F73]">
          Find pieces by name, category or description — or browse the full
          collection.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-sm bg-[#17181A] px-6 text-sm font-medium text-white transition-colors duration-150 hover:bg-[#454F45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
        >
          Browse all products
        </Link>
      </div>
    )
  }

  // Request in flight — skeleton matches grid/list dimensions so there's
  // no layout shift once real results land.
  if (searchQueryState === 'loading') {
    return <ProductResultsSkeleton view={view} />
  }

  // Explicit "notfound" state, or a defensive fallback if products ever
  // arrive empty without the state having caught up — same guard the
  // original component had.
  if (
    searchQueryState === 'notfound' ||
    products == null ||
    products.data.length === 0
  ) {
    return <ProductNotFound />
  }
  
  
  return (
    <div>
      <ResultsToolbar
        onSortChange={onSortChange}
        openToggle={openToggle}
        setOpenToggle={setOpenToggle}
        pagination={pagination}
        setView={onViewChange}
        view={view}
      />

      {view === 'list' ? (
        <div className="mt-6 flex flex-col gap-4">
          {products.data.map((product: ProductWithImages) => (
            <ProductListItem
              key={product.id}
              product={product}
              isWishlisted={isWishlisted(Number(product.id))}
              onToggleWishlist={() =>
                toggle(Number(product.id))
              }
            />
          ))}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.data.map((product: ProductWithImages) => (
            <ProductCard isWishlisted={isWishlisted(Number(product.id))} onToggleWishlist={()=> toggle(Number(product.id))} key={product.id} product={product} />
          ))}
        </div>
      )}

       <ResultsPagination
        className="my-10"
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={onPageChange!}
      />
    </div>
  )
}

export default SearchResult