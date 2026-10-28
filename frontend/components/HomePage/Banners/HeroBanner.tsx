import Image from "next/image";
import React from "react";
import banner from "@/assets/hero-banner.png";
import { Button } from "../../ui/button";
import { ArrowRight } from "lucide-react";
import { Separator } from "../../ui/separator";
import { fraunces } from "@/fonts/fonts";
import Link from "next/link";

const HeroBanner = () => {
  return (
    <section
      className={`${fraunces.variable} bg-[#FAF8F5] px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14`}
    >
      <div className="relative mx-auto w-full max-w-7xl overflow-hidden rounded-xl sm:rounded-2xl aspect-4/3 sm:aspect-16/8 lg:aspect-16/7">
        <Image
          src={banner}
          fill
          priority
          alt="New arrivals"
          className="object-cover"
        />

        <div className="absolute inset-0 z-10 bg-black/5" />

        <div className="absolute inset-0 z-20 flex items-center">
          <div className="px-5 sm:px-10 lg:px-16 max-w-[90%] sm:max-w-[65%] lg:max-w-[55%]">
            
            <div>
              <h2 className="text-xs font-light tracking-[0.2em] sm:text-sm lg:text-base">
                NEW ARRIVALS
              </h2>

              <Separator className="my-3 w-10 bg-black/50 sm:my-4 sm:w-12" />
            </div>

            <h1
              className="text-2xl leading-tight sm:text-4xl md:text-5xl lg:text-7xl"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              Everyday, Elevated.
            </h1>

            <p className="mt-3 hidden text-sm font-light text-black sm:block md:mt-5 md:text-base lg:text-lg">
              Timeless essentials, thoughtfully designed for the way you live.
            </p>

            <p className="mt-3 text-xs font-light text-black sm:hidden">
              Thoughtfully designed essentials.
            </p>

<Link href="/shop?sort=newest">
            <Button className="mt-5 cursor-pointer h-11 rounded-none px-5 text-xs font-light tracking-widest sm:mt-6 sm:h-12 sm:px-6 sm:text-sm md:text-base">
              SHOP NEW ARRIVALS
              <ArrowRight className="ml-2 size-4" />
            </Button>
</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;