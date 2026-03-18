import { Gem, Handshake, PencilRuler, ShieldCheck, Trees } from "lucide-react";
import { homeValueProps } from "@/data/homepage";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { SectionWrapper } from "@/components/ui/section-wrapper";

const icons = [Trees, PencilRuler, Handshake, ShieldCheck, Gem];

export function ValueProps() {
  return (
    <SectionWrapper id="why-artizan-lemn" tone="muted" containerClassName="space-y-10">
      <Reveal>
        <SectionHeading
          eyebrow="Why Artizan Lemn"
          title="De ce clientii aleg atelierul nostru"
          description="Punem accent pe material, proces si dialog, astfel incat rezultatul final sa aiba valoare in timp."
        />
      </Reveal>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {homeValueProps.map((item, index) => {
          const Icon = icons[index % icons.length];

          return (
            <Reveal key={item.id} delay={index * 0.06}>
              <article className="luxury-card h-full space-y-4 p-5">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-sand-300 bg-sand-100 text-wood-900">
                  <Icon size={18} />
                </span>
                <h3 className="text-3xl">{item.title}</h3>
                <p className="text-sm text-wood-700">{item.description}</p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
