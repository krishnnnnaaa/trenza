import { ArrowRight, Mail } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

export interface PolicyContactBannerProps {
  /** static import, e.g. import bannerImage from "@/assets/contact-banner.png" */
  image: StaticImageData;
  alt?: string;
  description: string;
}

export function PolicyContactBanner({ image, alt = "Trenza contact banner", description }: PolicyContactBannerProps) {
  return (
    <section
      aria-labelledby="policy-contact-heading"
      className="flex flex-col overflow-hidden rounded-lg border border-[#E3DFD8] bg-[#F3F0E9] md:h-33 md:flex-row md:items-stretch"
    >
      {/* image area: ~30% wide, landscape; mobile keeps 16:7; desktop fills banner height */}
      <div className="relative aspect-16/7 w-full shrink-0 overflow-hidden md:aspect-auto md:h-full md:w-[30%]">
        <Image
          src={image}
          alt={alt}
          sizes="(min-width: 768px) 30vw, 100vw"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col justify-center gap-4 p-5 md:flex-row md:items-center md:justify-between md:gap-6 md:px-8 md:py-0">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#857F73]">Have any questions?</p>
          <h2 id="policy-contact-heading" className="mt-1 font-serif text-xl font-normal text-[#17181A] sm:text-2xl">
            We&rsquo;re here to help
          </h2>
          <p className="mt-1 max-w-lg text-sm leading-5 text-[#857F73]">{description}</p>
        </div>

        <Link
          href="/contact"
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-[#2E352E] px-6 text-sm font-medium text-white transition-colors hover:bg-[#454F45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45]/40 focus-visible:ring-offset-2"
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          Contact Us
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}