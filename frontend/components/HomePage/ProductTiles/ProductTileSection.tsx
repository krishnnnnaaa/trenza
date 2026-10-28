import { ProductTile } from "@/types/types";
import { ProductTileCard } from "./ProductTileCard";
import productTile1 from '@/assets/productTile-1.png'
import productTile2 from '@/assets/ProductTile-2.png'
import productTile3 from '@/assets/ProductTile-3.png'


// Mock data — swap for a real fetch/CMS source later without touching CategoryCard.
const promotionalTiles:ProductTile[] = [
  {
    id: "everyday-elevated",
    label: "EVERYDAY, ELEVATED.",
    title: "Thoughtful choices for the way you live.",
    cta: "EXPLORE MORE",
    href: "/shop?category=womens-bags",
    imageSrc: productTile1.src,
    imageAlt: "Elegant dark green leather handbag",
  },
  {
    id: "space-refined",
    label: "YOUR SPACE, REFINED.",
    title: "Pieces that make everyday living feel better.",
    cta: "DISCOVER MORE",
    href: "/shop?category=furniture",
    imageSrc: productTile2.src,
    imageAlt: "Modern cream armchair in a warm interior",
  },
  {
    id: "move-with-intention",
    label: "MOVE WITH INTENTION.",
    title: "Designed to keep up with your everyday.",
    cta: "EXPLORE MORE",
    href: "/shop?category=mens-watches",
    imageSrc: productTile3.src,
    imageAlt: "Minimal smartwatch with a cream band",
  },
];
export function ProductTileSection() {
  return (
    <section
      aria-labelledby="categories-heading"
      className="bg-[#FAF8F5] py-8 sm:py-12"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {promotionalTiles.map((productTile) => (
            <ProductTileCard key={productTile.id} productTile={productTile} />
          ))}
        </div>
      </div>
    </section>
  );
}