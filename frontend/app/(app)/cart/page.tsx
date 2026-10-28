import CartMainContent from '@/components/cart-page/CartMainContent'
import { fraunces } from '@/fonts/fonts'
import React from 'react'

const page = () => {
  return (
    <main className="min-h-screen w-full bg-[#FAF8F5]">
         <div
           className={`
             mx-auto w-full max-w-7xl
             px-4 py-4
             sm:px-6 sm:py-12
             lg:px-8 lg:py-8
             ${fraunces.variable}
           `}
         >
            <CartMainContent/>
            </div>
            </main>
  )
}

export default page