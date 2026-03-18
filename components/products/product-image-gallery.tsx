"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type ProductImageGalleryProps = {
  images: string[];
  title: string;
  priority?: boolean;
};

export function ProductImageGallery({
  images,
  title,
  priority = false,
}: ProductImageGalleryProps) {
  const galleryImages = useMemo(() => images.filter(Boolean), [images]);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!galleryImages.length) {
    return null;
  }

  const activeImage = galleryImages[Math.min(activeIndex, galleryImages.length - 1)];

  return (
    <div className="space-y-4">
      <a
        href={activeImage}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block aspect-[4/3] overflow-hidden rounded-3xl border border-sand-300/70 bg-white"
      >
        <Image
          src={activeImage}
          alt={`${title} - imagine principala`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          priority={priority}
        />
      </a>

      <div className="flex flex-wrap gap-2.5">
        {galleryImages.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={cn(
              "relative h-16 w-16 overflow-hidden rounded-xl border transition-all duration-300 sm:h-20 sm:w-20",
              index === activeIndex
                ? "border-wood-900 ring-2 ring-wood-900/20"
                : "border-sand-300 hover:border-sand-400",
            )}
            aria-label={`Selecteaza imaginea ${index + 1} pentru ${title}`}
            aria-pressed={index === activeIndex}
          >
            <Image
              src={image}
              alt={`${title} - miniatura ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      <p className="product-body-soft text-xs">
        Apasa pe imaginea principala pentru deschidere in tab nou, la dimensiune
        mare.
      </p>
    </div>
  );
}
