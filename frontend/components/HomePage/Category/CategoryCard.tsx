import { CategoryCircularCard } from '@/types/types'
import Link from 'next/link'
import React from 'react'

const CategoryCard = ({icon:Icon, name, slug, url}:CategoryCircularCard) => {
  return (
    <Link href={url ?? `/shop?category=${slug}`} className='flex text-center flex-col justify-center items-center'>
      <Icon size={70} className='bg-[#F0EDE7] shadow-md mb-4 w-fit p-4 border-4 border-white rounded-full'/>
      <span className='text-xs font-bold'>{name}</span>
    </Link>
  )
}

export default CategoryCard