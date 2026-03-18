import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

const highlights = [
  {
    value: "100%",
    label: "lemn masiv atent selecționat",
  },
  {
    value: "Bespoke",
    label: "fiecare piesă este unică",
  },
  {
    value: "Atelier propriu",
    label: "execuție integrală internă",
  },
];

export function HomeHeroSection() {
  return (
    <section className="relative isolate overflow-hidden border-b border-sand-300/70">
      <Image
        src="/images/hero/hero-main-table.png"
        alt="Masă premium din lemn masiv"
        fill
        priority
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-wood-950/88 via-wood-950/70 to-wood-950/20" />

      <Container className="relative grid min-h-[82vh] items-end gap-8 py-12 md:py-16 lg:grid-cols-[1.15fr_0.85fr]">
        <Reveal className="max-w-2xl space-y-6 pb-6 text-sand-50">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sand-100">
            Artizan Lemn | mobilier premium la comandă
          </p>
          <h1 className="text-5xl leading-[0.98] text-sand-50 md:text-7xl">
            Piese din lemn masiv create pentru spații cu identitate.
          </h1>
          <p className="text-base text-sand-100/90 md:text-lg">
            Proiectăm și realizăm mobilier personalizat pentru interior și
            exterior, cu atenție la detalii, proporții și durabilitate reală.
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/comanda-mobilier" size="lg">
              Cere ofertă personalizată
            </ButtonLink>
            <ButtonLink
              href="/galerie"
              variant="secondary"
              size="lg"
              className="border-sand-50/80 bg-sand-50/95"
            >
              Vezi lucrări recente
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal delay={0.14} className="pb-6 lg:justify-self-end">
          <div className="luxury-card max-w-md space-y-5 p-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/hero/hero-workshop-bar.png"
                alt="Detaliu bar din lemn masiv"
                fill
                className="object-cover"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {highlights.map((item) => (
                <div
                  key={item.value}
                  className="rounded-xl border border-sand-300 bg-sand-100/70 px-3 py-3 text-center"
                >
                  <p className="text-sm font-semibold text-wood-900">{item.value}</p>
                  <p className="mt-1 text-[11px] text-wood-700">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
