import HeroBanner from '@/components/search-page/HeroBanner'
import ProductSearch from '@/components/search-page/ProductSearch'
import { SearchBar } from '@/components/search-page/SearchBar'
import { Suspense } from 'react'

const page = () => {
  return (
    <section className='bg-[#faf9f6]'>
        <HeroBanner/>
        <Suspense
          fallback={
            <div className="flex min-h-[30vh] items-center justify-center">
              Loading products...
            </div>
          }
        >
          <SearchBar/>
          <ProductSearch/>
        </Suspense>
    </section>
  )
}

export default page