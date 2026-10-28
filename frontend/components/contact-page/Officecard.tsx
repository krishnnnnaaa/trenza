import { CONTACT_INFO } from "@/lib/constants/contactInfo";
import { ExternalLink, MapPin } from "lucide-react";


// Renders ONLY when a verified mapsUrl + address are configured. No fake map / marker.
export function OfficeCard() {
  const { address, mapsUrl } = CONTACT_INFO;
  if (!address || !mapsUrl) return null;

  return (
    <section className="flex flex-col justify-between gap-6 rounded-lg border border-[#E3DFD8] bg-[#FCFBF9] p-6 sm:p-8">
      <div>
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EDE9E2]">
          <MapPin className="h-5 w-5 text-[#17181A]" strokeWidth={1.6} aria-hidden="true" />
        </span>
        <h2 className="mt-4 font-serif text-2xl font-normal text-[#17181A]">Visit us</h2>
        <address className="mt-2 text-sm not-italic leading-6 text-[#857F73]">
          {address.lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </address>
      </div>
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-10 w-fit items-center gap-2 rounded-md border border-[#E3DFD8] bg-white px-4 text-sm font-medium text-[#17181A] transition-colors hover:bg-[#F0EDE7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45] focus-visible:ring-offset-2"
      >
        View on Google Maps
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
      </a>
    </section>
  );
}