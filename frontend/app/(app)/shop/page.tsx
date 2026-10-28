import HeroBanner from '@/components/search-page/HeroBanner'
import ProductSearch from '@/components/search-page/ProductSearch'
import { SearchBar } from '@/components/search-page/SearchBar'
import React from 'react'

const page = () => {
  return (
    <section className='bg-[#faf9f6]'>
        <HeroBanner/>
        <SearchBar/>
        <ProductSearch/>
    </section>
  )
}

export default page