import { GalleryCard } from "@/components/gallery/gallery-card";
import type { CatalogGalleryItem } from "@/types/catalog";

type GalleryGridProps = {
  items: CatalogGalleryItem[];
  compact?: boolean;
};

export function GalleryGrid({ items, compact = false }: GalleryGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => {
        const emphasize = !compact && (item.featured || index % 5 === 0);

        return <GalleryCard key={item.id} item={item} emphasize={emphasize} />;
      })}
    </div>
  );
}
