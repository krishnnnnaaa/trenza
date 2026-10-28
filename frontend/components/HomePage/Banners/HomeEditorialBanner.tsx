import Image from "next/image";
import React from "react";
import banner from "@/assets/home-editorial.png";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { fraunces } from "@/fonts/fonts";
import Link from "next/link";

const HomeEditorialBanner = () => {
  return (
    <section
      className={`${fraunces.variable} bg-[#FAF8F5] px-4 pt-10 sm:px-6 sm:pt-14 lg:px-8`}
    >
      <div className="relative mx-auto aspect-4/3 w-full max-w-7xl overflow-hidden rounded-xl sm:aspect-16/8 sm:rounded-2xl lg:aspect-16/5">
        <Image
          src={banner}
          fill
          priority
          alt="The Trenza Approach"
          className="rotate-y-180 object-cover"
        />

        <div className="absolute inset-0 z-10 bg-black/5" />

        <div className="absolute inset-0 z-20 flex items-center justify-end">
          <div
            className="
              w-[82%] px-5
              sm:w-[65%] sm:px-10
              md:w-[58%]
              lg:w-[52%] lg:px-16
            "
          >
            <div>
              <h2 className="text-[10px] font-light tracking-[0.18em] sm:text-xs sm:tracking-[0.2em] md:text-sm lg:text-base">
                THE TRENZA APPROACH
              </h2>

              <Separator className="my-2.5 w-[32px!important] bg-black/50 sm:my-3 sm:w-10 md:my-4 md:w-12" />
            </div>

            <h1
              className="
                max-w-105
                sm:text-[clamp(1.5rem,4vw,3rem)]
                lg:text-3xl
    text-lg
                leading-[1.08]
              "
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              Thoughtfully designed.
              <br />
              Made for everyday living.
            </h1>

<Link href='/shop?category=mens-shoes'>
            <Button
              className="
                mt-4 h-10
                rounded-none px-4
                text-[10px] font-light tracking-[0.12em]
                sm:mt-5 sm:h-11 sm:px-5 sm:text-xs
                md:mt-6 md:h-12 md:px-6 md:text-sm
              "
            >
              EXPLORE THE COLLECTION
              <ArrowRight className="ml-2 size-3.5 sm:size-4" />
            </Button>
              </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeEditorialBanner;