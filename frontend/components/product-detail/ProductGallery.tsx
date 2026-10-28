"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types/types";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const initialIndex = Math.max(
    images.findIndex((image) => image.isPrimary),
    0,
  );
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-[#F0EDE7] text-sm text-[#857F73]">
        No image available
      </div>
    );
  }

  const selectedImage = images[selectedIndex];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[#F0EDE7]">
        <Image
          key={selectedImage.id}
          src={selectedImage.url}
          alt={productName}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-contain p-6"
        />
      </div>

      {images.length > 1 && (
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Product images"
        >
          {images.map((image, index) => {
            const isSelected = index === selectedIndex;
            return (
              <button
                key={image.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-label={`View image ${index + 1} of ${images.length}`}
                onClick={() => setSelectedIndex(index)}
                className={cn(
                  "relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-[#F0EDE7] ring-1 ring-inset transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#454F45]",
                  isSelected ? "ring-2 ring-[#454F45]" : "ring-[#E3DFD8] hover:ring-[#CFC9BF]",
                )}
              >
                <Image
                  src={image.url}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-contain p-1.5"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
