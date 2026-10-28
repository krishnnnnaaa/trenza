import { ChevronRight } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { PolicyReveal } from "./PolicyReveal";

export interface PolicyHeroProps {
  title: string;
  description: string;
  /** ISO "YYYY-MM-DD" or null */
  lastUpdated: string | null;
  imageSrc: string | StaticImageData;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? null
    : d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

export function PolicyHero({ title, description, lastUpdated, imageSrc }: PolicyHeroProps) {
  const updated = lastUpdated ? formatDate(lastUpdated) : null;

  return (
    <section className="relative isolate overflow-hidden bg-[#EFEBE3]">
      {/* image area: right ~40%, landscape, object-cover; hidden on mobile for readability */}
      <div className="absolute inset-y-0 right-0 -z-10 hidden w-[40%] md:block">
        <Image src={imageSrc} alt="" fill priority sizes="40vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-linear-to-r from-[#EFEBE3] via-[#EFEBE3]/0 to-transparent" />
      </div>

      <PolicyReveal className="mx-auto flex min-h-50 max-w-7xl flex-col justify-center px-4 py-8 sm:px-6 md:h-57.5 md:py-0 lg:px-10">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 text-xs text-[#857F73]">
            <li>
              <Link href="/" className="transition-colors hover:text-[#454F45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45]">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="h-3 w-3" />
            </li>
            <li aria-current="page" className="text-[#17181A]">
              {title}
            </li>
          </ol>
        </nav>

        <h1 className="mt-3 font-serif text-4xl font-normal text-[#17181A] sm:text-5xl">{title}</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[#514B43] sm:text-base sm:leading-7">{description}</p>
        <p className="mt-3 text-xs text-[#857F73]">Last updated: {updated ?? "October 26, 2026"}</p>
      </PolicyReveal>
    </section>
  );
}