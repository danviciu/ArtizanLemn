import type { Metadata } from "next";
import { CustomQuoteCtaSection } from "@/components/sections/custom-quote-cta-section";
import { ProcessSection } from "@/components/sections/process-section";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Cum lucrăm",
  description:
    "Procesul Artizan Lemn: de la brief și concept până la execuție, livrare și montaj pentru mobilier premium la comandă.",
  path: "/cum-lucram",
  image: "/images/hero/hero-workshop-bar.png",
});

const pillars = [
  {
    title: "Dialog real, fără șabloane",
    text: "Nu pornim de la un configurator fix. Înțelegem contextul și traducem ideea ta într-o soluție coerentă.",
  },
  {
    title: "Materiale alese responsabil",
    text: "Lucrăm cu esențe de calitate și tratamente potrivite mediului unde va fi utilizată piesa.",
  },
  {
    title: "Execuție atentă la detalii",
    text: "Îmbinări curate, finisaje controlate și testare practică înainte de livrare.",
  },
  {
    title: "Montaj profesionist",
    text: "Integrarea finală este parte din proiect, nu un pas separat. Ajustăm până totul se aliniază perfect.",
  },
];

export default function CumLucramPage() {
  return (
    <>
      <PageHero
        eyebrow="Procesul Artizan Lemn"
        title="Meșteșug modern, disciplină de atelier"
        description="Construim fiecare proiect cu metodă clară, comunicare directă și respect pentru material."
        image="/images/hero/hero-main-table.png"
      />

      <ProcessSection />

      <section className="section-space">
        <Container className="grid gap-6 md:grid-cols-2">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="luxury-card p-6">
              <h2 className="text-3xl">{pillar.title}</h2>
              <p className="mt-3 text-sm text-wood-700">{pillar.text}</p>
            </article>
          ))}
        </Container>
      </section>

      <CustomQuoteCtaSection />
    </>
  );
}
