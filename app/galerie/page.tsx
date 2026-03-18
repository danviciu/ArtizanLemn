import type { Metadata } from "next";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { PageIntro } from "@/components/ui/page-intro";
import { PrimaryButtonLink } from "@/components/ui/primary-button";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { galleryItems } from "@/data/gallery";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Galerie de lucrari",
  description:
    "Selectie de proiecte Artizan Lemn care ilustreaza modul in care lucram lemnul masiv, cu atentie la proportie, textura si finisaj.",
  path: "/galerie",
  image: "/images/galerie/terasa-eleganta.png",
});

export default function GaleriePage() {
  return (
    <>
      <SectionWrapper
        className="border-b border-sand-300/70"
        containerClassName="space-y-6"
      >
        <PageIntro
          eyebrow="Portofoliu vizual"
          title="Galerie de lucrari"
          description="Selectie de proiecte si piese care ilustreaza felul in care lucram lemnul masiv: cu atentie pentru proportii, textura, finisaj si integrarea in spatiu."
        />
      </SectionWrapper>

      <SectionWrapper containerClassName="space-y-8">
        <GalleryGrid items={galleryItems} />
      </SectionWrapper>

      <SectionWrapper tone="muted">
        <div className="luxury-card border-wood-900/15 bg-wood-950 p-8 text-sand-50 md:p-10">
          <h2 className="text-4xl text-sand-50 md:text-5xl">
            Vrei o piesa in acelasi registru?
          </h2>
          <p className="mt-4 max-w-3xl text-sm text-sand-100/90 md:text-base">
            Trimite-ne cateva imagini de inspiratie si contextul spatiului tau.
            Revenim cu o propunere personalizata.
          </p>
          <PrimaryButtonLink href="/comanda-mobilier" className="mt-7">
            Solicita oferta
          </PrimaryButtonLink>
        </div>
      </SectionWrapper>
    </>
  );
}
