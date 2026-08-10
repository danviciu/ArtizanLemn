import { homeProcessSteps } from "@/data/homepage";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { SectionWrapper } from "@/components/ui/section-wrapper";

export function ProcessSteps() {
  return (
    <SectionWrapper id="proces" containerClassName="space-y-10">
      <Reveal>
        <SectionHeading
          eyebrow="Cum incepi"
          title="Trei pasi simpli pentru mobilier la comanda"
          description="Proces clar pentru proiecte personalizate din lemn masiv, fara etape complicate."
        />
      </Reveal>

      <div className="grid gap-5 md:grid-cols-3">
        {homeProcessSteps.map((step, index) => (
          <Reveal key={step.id} delay={index * 0.08}>
            <article className="luxury-card h-full p-6">
              <h3 className="text-3xl">{step.title}</h3>
              <p className="mt-3 text-sm text-wood-700">{step.description}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </SectionWrapper>
  );
}
