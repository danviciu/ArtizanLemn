import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function CustomQuoteCtaSection() {
  return (
    <section className="section-space">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] border border-sand-300 bg-wood-950 px-7 py-12 text-sand-50 md:px-12 md:py-16">
          <Image
            src="/images/hero/hero-exterior-foisoare.png"
            alt="Detaliu proiect exterior Artizan Lemn"
            fill
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-wood-950 via-wood-950/85 to-wood-900/70" />

          <div className="relative max-w-3xl space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sand-100">
              Proiect custom
            </p>
            <h2 className="text-4xl text-sand-50 md:text-5xl">
              Ai o idee de mobilier? Spune-ne cum vrei să arate spațiul tău.
            </h2>
            <p className="text-base text-sand-100/90 md:text-lg">
              Trimite un brief liber, fotografii de inspirație și dimensiuni
              orientative. Îți răspundem cu o direcție clară și pașii de execuție.
            </p>

            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/comanda-mobilier" size="lg" variant="secondary">
                Completează cererea
              </ButtonLink>
              <ButtonLink
                href="/contact"
                size="lg"
                className="border-sand-50/55 bg-transparent text-sand-50 hover:bg-sand-50/10"
              >
                Discută cu atelierul
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
