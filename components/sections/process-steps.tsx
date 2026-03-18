import { homeProcessSteps } from "@/data/homepage";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { SectionWrapper } from "@/components/ui/section-wrapper";

export function ProcessSteps() {
  return (
    <SectionWrapper id="proces" containerClassName="space-y-10">
      <Reveal>
        <SectionHeading
          eyebrow="Proces"
          title="De la idee la piesa finala"
          description="Un traseu simplu si clar, construit pentru proiecte personalizate."
        />
      </Reveal>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
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
