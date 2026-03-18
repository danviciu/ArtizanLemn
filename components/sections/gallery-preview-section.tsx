import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { galleryItems } from "@/data/gallery";

const previewItems = galleryItems.slice(0, 6);

export function GalleryPreviewSection() {
  return (
    <section className="section-space">
      <Container className="space-y-10">
        <Reveal>
          <SectionHeading
            eyebrow="Galerie"
            title="Lucrări recente din atelier"
            description="Selecție de proiecte finalizate, de la mobilier interior până la elemente structurale și amenajări exterioare."
          />
        </Reveal>

        <Reveal delay={0.08}>
          <GalleryGrid items={previewItems} compact />
        </Reveal>

        <ButtonLink href="/galerie" variant="secondary">
          Deschide galeria completă
        </ButtonLink>
      </Container>
    </section>
  );
}
