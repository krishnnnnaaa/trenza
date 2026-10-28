import Image from "next/image";
import promotionalBanner from "@/assets/electronics-banner.png";
import Link from "next/link";

const ElectronicsPromoBanner = () => {
  return (
    <section className="px-4 py-10 max-w-7xl mx-auto sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto w-full  overflow-hidden rounded-xl sm:rounded-2xl">
        <Link href='/shop?category=smartphones'>
        <Image
          src={promotionalBanner}
          alt="Electronics sale featuring smartphones, tablets and laptops with up to 50% off"
          width={2048}
          height={768}
          sizes="100vw"
          className="h-auto w-full"
          />
          </Link>
      </div>
    </section>
  );
};

export default ElectronicsPromoBanner;