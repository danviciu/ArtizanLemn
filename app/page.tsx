import type { Metadata } from "next";
import { CTASection } from "@/components/sections/cta-section";
import { FeaturedCategoriesSection } from "@/components/sections/featured-categories-section";
import { FeaturedProductsSection } from "@/components/sections/featured-products-section";
import { GalleryPreview } from "@/components/sections/gallery-preview";
import { HeroSection } from "@/components/sections/hero-section";
import { ProcessSteps } from "@/components/sections/process-steps";
import { ValueProps } from "@/components/sections/value-props";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Mobilier premium din lemn masiv",
  description:
    "Artizan Lemn realizeaza mobilier premium din lemn masiv la comanda, cu executie atenta si dialog direct cu atelierul.",
  path: "/",
  image: "/images/hero/hero-main-table.png",
});

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedCategoriesSection />
      <FeaturedProductsSection />
      <ProcessSteps />
      <GalleryPreview />
      <ValueProps />
      <CTASection />
    </>
  );
}
