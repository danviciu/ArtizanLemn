import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { processSteps } from "@/data/process";

export function ProcessSection() {
  return (
    <section className="section-space border-y border-sand-300/70 bg-white/70">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow="Cum lucrăm"
          title="De la idee la piesa finală"
          description="Un proces clar, orientat spre detalii, cu dialog constant și control al calității în fiecare etapă."
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {processSteps.map((step, index) => (
            <Reveal key={step.id} delay={index * 0.08}>
              <article className="luxury-card h-full space-y-3 p-5">
                <h3 className="text-2xl">{step.title}</h3>
                <p className="text-sm text-wood-700">{step.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
