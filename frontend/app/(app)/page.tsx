import { TrustFeatures } from "@/components/HomePage/Banners/BrandTrustStrip";
import HeroBanner from "@/components/HomePage/Banners/HeroBanner";
import HomeEditorialBanner from "@/components/HomePage/Banners/HomeEditorialBanner";
import ElectronicsPromoBanner from "@/components/HomePage/Banners/PromotionalBanner";
import CategorySection from "@/components/HomePage/Category/CategorySection";
import { Newsletter } from "@/components/HomePage/Newsletter/Newsletter";
import { ProductSection } from "@/components/HomePage/Product/ProductSection";
import { ProductTileSection } from "@/components/HomePage/ProductTiles/ProductTileSection";
import { TrendingSection } from "@/components/HomePage/Trending/TrendingSection";

export default function Home() {
  return (
   <div className="bg-[#FAF8F5] scroll-smooth">
    <HeroBanner/>
    <CategorySection/>
    <ProductSection id="newest" title="New Arrivals" subtitle=" Discover our latest pieces."/>
    <HomeEditorialBanner/>
    <ProductSection id="featured" title="FEATURED COLLECTION" subtitle="Pieces worth discovering"/>
    <ProductTileSection/>
    <TrustFeatures/>
    <TrendingSection/>
    <ElectronicsPromoBanner/>
    <Newsletter/>
   </div>
  );
}
