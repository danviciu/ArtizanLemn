import Image from "next/image";
import { Container } from "@/components/ui/container";
import { PrimaryButtonLink } from "@/components/ui/primary-button";
import { SecondaryButtonLink } from "@/components/ui/secondary-button";
import { Reveal } from "@/components/ui/reveal";

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden border-b border-sand-300/70">
      <Image
        src="/images/hero/hero-main-table.png"
        alt="Mobilier premium din lemn masiv"
        fill
        priority
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-wood-950/88 via-wood-950/68 to-wood-950/26" />

      <Container className="relative grid min-h-[84vh] items-end gap-8 py-12 md:py-16 lg:grid-cols-[1.2fr_0.8fr]">
        <Reveal className="max-w-3xl space-y-6 pb-8 text-sand-50">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sand-100">
            Atelier artizanal premium
          </p>

          <h1 className="text-5xl leading-[0.98] text-sand-50 md:text-7xl">
            Mobilier premium din lemn masiv, lucrat pe comanda.
          </h1>

          <p className="max-w-2xl text-base text-sand-100/92 md:text-lg">
            Transformam idei, schite si inspiratii in piese realizate cu atentie
            pentru material, proportii si detalii.
          </p>

          <div className="flex flex-wrap gap-3">
            <PrimaryButtonLink
              href="/comanda-mobilier"
              size="lg"
              data-track-event="cta_click"
              data-track-label="Solicita oferta"
              data-track-location="home_hero"
            >
              Solicita oferta
            </PrimaryButtonLink>
            <SecondaryButtonLink
              href="/galerie"
              size="lg"
              className="border-sand-50/85 bg-sand-50/95"
              data-track-event="cta_click"
              data-track-label="Vezi lucrarile"
              data-track-location="home_hero"
            >
              Vezi lucrarile
            </SecondaryButtonLink>
          </div>

          <div className="grid gap-2 pt-2 text-sm text-sand-100/90 sm:grid-cols-3">
            <p className="rounded-xl border border-sand-50/18 bg-wood-950/28 px-3 py-2">
              Raspuns in 1-2 zile lucratoare
            </p>
            <p className="rounded-xl border border-sand-50/18 bg-wood-950/28 px-3 py-2">
              Poti trimite schite, poze si inspiratii
            </p>
            <p className="rounded-xl border border-sand-50/18 bg-wood-950/28 px-3 py-2">
              Executam pe dimensiunile spatiului tau
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.12} className="hidden lg:block lg:justify-self-end">
          <div className="luxury-card max-w-md p-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/hero/hero-workshop-bar.png"
                alt="Detaliu proiect premium din lemn"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
