import Image from "next/image";
import HERO_IMAGE from "../../assets/contact-banner.png";

// TODO: put the supplied hero image at public/images/contact-hero.jpg (or change the path here).

export function ContactHero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#D9C9B6]">
      {/* image sits on the right; vase + books stay visible */}
      <div className="absolute inset-y-0 right-0 -z-10 w-full ">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          sizes="(min-width: 768px) 58vw, 100vw"
          className="object-cover "
        />
        <div className="absolute inset-0 bg-black/10" aria-hidden="true" />
      </div>

      <div className="mx-auto flex min-h-62.5 max-w-7xl flex-col justify-center px-4 py-10 sm:px-6 md:min-h-67.5 lg:px-10">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#857F73]">
          Contact Us
        </p>
        <h1 className="mt-3 font-serif text-4xl font-normal leading-tight text-[#17181A] sm:text-5xl lg:text-6xl">
          We&rsquo;re here to help
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-[#514B43] sm:text-base sm:leading-7">
          Have a question, need help with an order, or just want to say hello?
          We&rsquo;d love to hear from you. Our team is here to assist you.
        </p>
        <span className="mt-6 block h-px w-16 bg-[#17181A]/70" aria-hidden="true" />
      </div>
    </section>
  );
}