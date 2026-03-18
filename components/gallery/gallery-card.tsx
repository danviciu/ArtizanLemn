import Image from "next/image";
import type { CatalogGalleryItem } from "@/types/catalog";

type GalleryCardProps = {
  item: CatalogGalleryItem;
  emphasize?: boolean;
};

export function GalleryCard({ item, emphasize = false }: GalleryCardProps) {
  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border border-sand-300/75 bg-white ${
        emphasize ? "sm:col-span-2" : ""
      }`}
      data-lightbox-ready="true"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={item.image}
          alt={`${item.title} - ${item.category}`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-wood-950/93 via-wood-950/70 to-transparent p-4 text-sand-50">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sand-100">
          {item.category}
        </p>
        <p className="mt-1 text-sm font-medium">{item.title}</p>
        <p className="mt-1 text-xs text-sand-100/85">{item.caption}</p>
      </div>
    </article>
  );
}
