import { ProductDetailResponse } from "@/types/types";

interface ProductDescriptionProps {
  data: ProductDetailResponse;
}

export function ProductDescription({ data }: ProductDescriptionProps) {
  if (!data.description) return null;

  return (
    <section
      aria-labelledby="product-description-heading"
      className="mt-16 border-t border-[#E3DFD8] pt-10"
    >
      <h2
        id="product-description-heading"
        className="font-serif text-xl font-normal text-[#17181A]"
      >
        Description
      </h2>
      <p className="mt-4 max-w-3xl whitespace-pre-line text-sm leading-relaxed text-[#857F73]">
        {data.description}
      </p>
    </section>
  );
}
