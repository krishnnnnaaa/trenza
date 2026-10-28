import { fraunces, inter } from "@/fonts/fonts";
import { ProductTile } from "@/types/types";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";



interface ProductTileCardProps {
  productTile: ProductTile;
}

export function ProductTileCard({ productTile }: ProductTileCardProps) {
  return (
    <Link
      href={productTile.href}
      className={`group relative block aspect-video overflow-hidden rounded-xl bg-[#1B1B19] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2 ${fraunces.variable} ${inter.variable}`}
    >
      <Image
        src={productTile.imageSrc}
        alt={productTile.imageAlt}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
      />

      {/* Subtle overlay for text legibility, deepens slightly on hover */}
      <div
        className="absolute inset-0 bg-linear-to-t from-black/45 via-black/10 to-transparent transition-colors duration-300 group-hover:from-black/55"
        aria-hidden="true"
      />

      <div className="absolute inset-0 flex items-start justify-center px-4 flex-col">

        <span className=" text-xs font-semibold tracking-tight text-[#17181A]">
          {productTile.label}
        </span>
        <span style={{fontFamily: "var(--font-fraunces)"}} className="font text-base my-4 w-48 sm:w-60 font-medium tracking-tight text-[#17181A] sm:text-xl">
          {productTile.title}
        </span>
        <span style={{fontFamily: "var(--font-inter)"}} className="font text-sm flex items-center tracking-tight text-[#17181A]">
          {productTile.cta} <ArrowRight className="inline ml-2" size={20}/>
        </span>

      </div>
    </Link>
  );
}