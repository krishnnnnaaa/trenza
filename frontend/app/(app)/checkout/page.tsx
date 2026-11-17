import CheckoutPageComponent from '@/components/checkout-page/CheckoutPageComponent'
import { Suspense } from 'react'

const CheckoutPage = () => {
  return (
    <div className="min-h-screen w-full bg-[#FAF8F5]">
        <Suspense
          fallback={
            <div className="flex min-h-[50vh] items-center justify-center">
              Loading checkout...
            </div>
          }
        >
          <CheckoutPageComponent />
        </Suspense>
    </div>
  )
}

export default CheckoutPage