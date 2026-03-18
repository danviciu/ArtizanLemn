import { CategoryCard } from "@/components/sections/category-card";
import { homeCategories } from "@/data/homepage";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { SectionWrapper } from "@/components/ui/section-wrapper";

export function FeaturedCategoriesSection() {
  return (
    <SectionWrapper id="categorii" containerClassName="space-y-10">
      <Reveal>
        <SectionHeading
          eyebrow="Categorii reprezentative"
          title="Directii de proiect pentru spatii premium"
          description="Fiecare categorie este tratata ca un proiect personalizat, nu ca un produs de serie."
        />
      </Reveal>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {homeCategories.map((item, index) => (
          <Reveal key={item.id} delay={index * 0.06}>
            <CategoryCard item={item} />
          </Reveal>
        ))}
      </div>
    </SectionWrapper>
  );
}
