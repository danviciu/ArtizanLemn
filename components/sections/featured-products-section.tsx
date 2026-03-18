import { RepresentativeProductCard } from "@/components/sections/representative-product-card";
import { representativePieces } from "@/data/homepage";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { SecondaryButtonLink } from "@/components/ui/secondary-button";

export function FeaturedProductsSection() {
  return (
    <SectionWrapper id="piese" tone="muted" containerClassName="space-y-10">
      <Reveal>
        <SectionHeading
          eyebrow="Piese reprezentative"
          title="Selectie inspirationala din atelier"
          description="Aceasta zona nu este un catalog de vanzare agresiva, ci o privire asupra nivelului de executie."
        />
      </Reveal>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {representativePieces.map((item, index) => (
          <Reveal key={item.id} delay={index * 0.06}>
            <RepresentativeProductCard item={item} />
          </Reveal>
        ))}
      </div>

      <SecondaryButtonLink href="/produse">Vezi toate lucrarile</SecondaryButtonLink>
    </SectionWrapper>
  );
}
