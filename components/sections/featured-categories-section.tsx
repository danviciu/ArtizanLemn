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
          eyebrow="Ce putem realiza"
          title="Categorii de mobilier premium din lemn masiv"
          description="Alege directia potrivita proiectului tau si vezi exemple reale din atelierul Artizan Lemn."
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
