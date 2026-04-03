import type { CatalogProduct } from "@/types/catalog";

const CATEGORY_EXAMPLE_TEMPLATES: Record<string, [string, string]> = {
  paturi: [
    "{title} din lemn masiv cu design modern",
    "{title} artizanal rezistent pentru dormitor",
  ],
  mese: [
    "{title} din lemn masiv pentru dining modern",
    "{title} artizanala rezistenta pentru uz zilnic",
  ],
  biblioteci: [
    "{title} din lemn masiv cu compartimentare moderna",
    "{title} artizanala rezistenta pentru living",
  ],
  bucatarii: [
    "{title} din lemn masiv la comanda",
    "{title} artizanala rezistenta pentru utilizare zilnica",
  ],
  "dulapuri-de-baie": [
    "{title} din lemn masiv tratat pentru umiditate",
    "{title} artizanal rezistent pentru baie",
  ],
  riflaje: [
    "{title} din lemn masiv pentru pereti moderni",
    "{title} artizanal rezistent pentru delimitari interioare",
  ],
  scari: [
    "{title} din lemn masiv cu design modern",
    "{title} artizanala rezistenta pentru trafic intens",
  ],
  "exterior-lemn": [
    "{title} din lemn masiv pentru exterior",
    "{title} artizanal rezistent la intemperii",
  ],
  "obiecte-decorative": [
    "{title} din lemn masiv cu design modern",
    "{title} artizanal rezistent pentru decor functional",
  ],
  "piese-personalizate": [
    "{title} din lemn masiv la comanda",
    "{title} artizanal rezistent pentru proiecte unicat",
  ],
};

function normalizePhrase(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function categoryToLabel(category: string) {
  return category.replace(/-/g, " ").trim();
}

export function getProductSeoExamples(
  product: Pick<CatalogProduct, "title" | "category">,
) {
  const templates = CATEGORY_EXAMPLE_TEMPLATES[product.category] ?? [
    "{title} din lemn masiv la comanda",
    "{title} artizanal rezistent pentru proiect personalizat",
  ];

  const title = product.title.toLowerCase();
  const examples = templates.map((template) =>
    normalizePhrase(template.replaceAll("{title}", title)),
  );

  return Array.from(new Set(examples)).slice(0, 2);
}

export function getProductSeoKeywordPhrases(
  product: Pick<CatalogProduct, "title" | "category" | "tags">,
) {
  const examples = getProductSeoExamples(product);
  const categoryLabel = categoryToLabel(product.category);

  const keywords = [
    ...product.tags,
    ...examples,
    `${product.title} la comanda`,
    `${product.title} din lemn masiv`,
    `${categoryLabel} din lemn masiv`,
  ];

  return Array.from(new Set(keywords.map(normalizePhrase).filter(Boolean)));
}
