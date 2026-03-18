import Image from "next/image";
import { homeGalleryItems } from "@/data/homepage";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { SecondaryButtonLink } from "@/components/ui/secondary-button";
import { cn } from "@/lib/utils";

export function GalleryPreview() {
  return (
    <SectionWrapper id="galerie-preview" containerClassName="space-y-10">
      <Reveal>
        <SectionHeading
          eyebrow="Lucrari recente"
          title="Calitate vizibila in fiecare detaliu"
          description="Selectie de proiecte finalizate in atelier, prezentate intr-un ritm vizual aerisit."
        />
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {homeGalleryItems.map((item, index) => (
          <Reveal key={item.id} delay={index * 0.05}>
            <article
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-sand-300/75 bg-white",
                index === 0 || index === 5 ? "sm:col-span-2" : "",
              )}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-wood-950/92 via-wood-950/65 to-transparent p-4 text-sand-50">
                <p className="text-sm font-medium">{item.title}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <SecondaryButtonLink href="/galerie">Vezi galeria completa</SecondaryButtonLink>
    </SectionWrapper>
  );
}
