import type { Metadata } from "next";
import { CTASection } from "@/components/sections/cta-section";
import { FeaturedCategoriesSection } from "@/components/sections/featured-categories-section";
import { FeaturedProductsSection } from "@/components/sections/featured-products-section";
import { GalleryPreview } from "@/components/sections/gallery-preview";
import { HeroSection } from "@/components/sections/hero-section";
import { ProcessSteps } from "@/components/sections/process-steps";
import { SearchFocusSection } from "@/components/sections/search-focus-section";
import { ValueProps } from "@/components/sections/value-props";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Mobilier la comanda din lemn masiv",
  description:
    "Artizan Lemn realizeaza mobilier la comanda din lemn masiv: paturi, mese, biblioteci, dulapuri de baie, riflaje si piese personalizate premium.",
  path: "/",
  image: "/images/hero/hero-main-table.png",
  keywords: [
    "mobilier la comanda",
    "mobilier premium din lemn masiv",
    "paturi din lemn masiv",
    "mese din lemn",
    "biblioteci din lemn",
    "dulapuri de baie din lemn",
    "riflaje din lemn",
    "piese personalizate din lemn",
  ],
});

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SearchFocusSection />
      <ProcessSteps />
      <FeaturedCategoriesSection />
      <FeaturedProductsSection />
      <GalleryPreview />
      <ValueProps />
      <CTASection />
    </>
  );
}
