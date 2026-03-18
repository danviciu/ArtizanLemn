import Image from "next/image";
import { Container } from "@/components/ui/container";
import { PrimaryButtonLink } from "@/components/ui/primary-button";
import { SecondaryButtonLink } from "@/components/ui/secondary-button";

export function CTASection() {
  return (
    <section className="section-space">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] border border-sand-300 bg-wood-950 px-7 py-12 md:px-12 md:py-16">
          <Image
            src="/images/hero/hero-exterior-foisoare.png"
            alt="Proiect Artizan Lemn pentru exterior"
            fill
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-wood-950 via-wood-950/88 to-wood-900/75" />

          <div className="relative max-w-3xl space-y-6 text-sand-50">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sand-100">
              Cerere personalizata
            </p>

            <h2 className="text-4xl text-sand-50 md:text-5xl">Ai o idee de mobilier?</h2>

            <p className="text-base text-sand-100/90 md:text-lg">
              Trimite-ne pe scurt ce iti doresti, chiar daca ai doar o directie
              generala. Iti raspundem cu pasii potriviti pentru proiectul tau.
            </p>

            <div className="flex flex-wrap gap-3">
              <PrimaryButtonLink href="/comanda-mobilier" size="lg">
                Trimite cererea ta
              </PrimaryButtonLink>
              <SecondaryButtonLink
                href="/contact"
                size="lg"
                className="border-sand-50/70 bg-transparent text-sand-50 hover:bg-sand-50/10"
              >
                Contacteaza-ne
              </SecondaryButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
