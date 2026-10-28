import Image from 'next/image'
import React from 'react'
import shopHero from '@/assets/shopHero.png'
import { Separator } from '../ui/separator'
import { colors } from '@/lib/constants/colors'
import { fraunces } from '@/fonts/fonts'

const HeroBanner = () => {
  return (
   <div className={`relative w-full h-50 sm:h-75 ${fraunces.variable}`}>
  <Image
    src={shopHero.src}
    alt=""
    fill
    className="object-cover object-[60%_center]"
  />

  <div className="absolute inset-0 flex items-center">
    <div className="max-w-xl px-6 sm:px-10 lg:px-16">
      <p className='md:text-base text-xs'>SHOP</p>
      <Separator className="md:w-10 w-[240px!important] my-2 md:my-4" style={{backgroundColor: colors.border.dark}}/>
      <h1 className='text-xl md:text-5xl md:mb-4' style={{fontFamily: "var(--font-fraunces)"}}>Discover <br /> Our Collection</h1>
      <p className='md:block hidden text-sm'>Timeless essentials, thoughtfully designed for the way you live.</p>
      <p className='md:hidden block text-xs' style={{color: colors.text.accent}}>Timeless essentials, thoughtfully <br /> designed for the way you live.</p>
    </div>
  </div>
</div>
  )
}

export default HeroBanner