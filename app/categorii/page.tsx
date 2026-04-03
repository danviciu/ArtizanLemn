import type { Metadata } from "next";
import { CategoryGrid } from "@/components/categories/category-grid";
import { JsonLd } from "@/components/seo/json-ld";
import { PageIntro } from "@/components/ui/page-intro";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { categories } from "@/data/categories";
import {
  createBreadcrumbJsonLd,
  createCategoryDirectoryJsonLd,
} from "@/lib/seo";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Categorii",
  description:
    "Exploreaza categoriile Artizan Lemn pentru mobilier premium din lemn masiv, realizat la comanda.",
  path: "/categorii",
  image: categories[0]?.image,
});

export default function CategoriiPage() {
  const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: "Acasa", path: "/" },
    { name: "Categorii", path: "/categorii" },
  ]);
  const categoryDirectoryJsonLd = createCategoryDirectoryJsonLd(categories);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={categoryDirectoryJsonLd} />
      <SectionWrapper
        className="border-b border-sand-300/70"
        containerClassName="space-y-6"
      >
        <PageIntro
          eyebrow="Categorii"
          title="Categorii de inspiratie pentru proiectul tau"
          description="Structura de mai jos reflecta direct lucrarile reale din atelier. Fiecare categorie include piese reprezentative si poate deveni punct de plecare pentru o cerere personalizata."
        />
        <p className="text-sm text-wood-700">
          {categories.length} categorii active, construite din imagini reale de
          proiect.
        </p>
      </SectionWrapper>

      <SectionWrapper containerClassName="space-y-8">
        <CategoryGrid categories={categories} />
      </SectionWrapper>
    </>
  );
}
