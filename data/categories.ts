import type { CatalogCategory } from "@/types/catalog";

export const categories: CatalogCategory[] = [
  {
    "id": "cat-paturi",
    "name": "Paturi",
    "slug": "paturi",
    "description": "Paturi din lemn masiv cu structura stabila si proportii curate, realizate pe comanda.",
    "image": "/images/produse/pat-bogdan/imagine-01-ansamblu.webp",
    "productCount": 4
  },
  {
    "id": "cat-mese",
    "name": "Mese si blaturi",
    "slug": "mese",
    "description": "Mese si blaturi din lemn masiv pentru dining sau zone de lucru, realizate pe dimensiuni reale.",
    "image": "/images/produse/blat-stejar-tohanita/imagine-01-ansamblu.webp",
    "productCount": 8
  },
  {
    "id": "cat-biblioteci",
    "name": "Biblioteci si rafturi",
    "slug": "biblioteci",
    "description": "Biblioteci si rafturi personalizate pentru organizare, expunere si integrare armonioasa in interior.",
    "image": "/images/produse/biblioteca-bucur/imagine-01-ansamblu.webp",
    "productCount": 2
  },
  {
    "id": "cat-bucatarii",
    "name": "Bucatarii",
    "slug": "bucatarii",
    "description": "Mobilier de bucatarie realizat pe configuratia spatiului, cu atentie la functionalitate si finisaj.",
    "image": "/images/produse/bucatarie-rustica-dan/imagine-01-ansamblu.webp",
    "productCount": 2
  },
  {
    "id": "cat-dulapuri-de-baie",
    "name": "Dulapuri de baie",
    "slug": "dulapuri-de-baie",
    "description": "Dulapuri si corpuri pentru baie, executate pe cotele reale ale spatiului si tratate pentru umiditate.",
    "image": "/images/produse/dulap-de-baie-comandau/imagine-01-ansamblu.webp",
    "productCount": 5
  },
  {
    "id": "cat-riflaje",
    "name": "Riflaje",
    "slug": "riflaje",
    "description": "Panouri riflate si accente verticale care ordoneaza vizual spatiul si aduc textura naturala.",
    "image": "/images/produse/riflaj-panou/imagine-01-ansamblu.webp",
    "productCount": 2
  },
  {
    "id": "cat-scari",
    "name": "Scari",
    "slug": "scari",
    "description": "Scari interioare din lemn realizate pe proiect, cu focus pe siguranta, proportii si detaliu.",
    "image": "/images/produse/scara-adela/imagine-01-ansamblu.webp",
    "productCount": 5
  },
  {
    "id": "cat-exterior-lemn",
    "name": "Elemente exterioare",
    "slug": "exterior-lemn",
    "description": "Porti, usi, marchize si structuri exterioare din lemn, realizate pe proiect si context arhitectural.",
    "image": "/images/produse/foisor-paul/imagine-01-ansamblu.webp",
    "productCount": 8
  },
  {
    "id": "cat-obiecte-decorative",
    "name": "Obiecte decorative",
    "slug": "obiecte-decorative",
    "description": "Obiecte mici din lemn cu caracter artizanal, potrivite pentru detalii functionale sau cadouri.",
    "image": "/images/produse/cartea-in-suport-diagonal/imagine-01-ansamblu.webp",
    "productCount": 7
  },
  {
    "id": "cat-piese-personalizate",
    "name": "Piese personalizate",
    "slug": "piese-personalizate",
    "description": "Lucrari unicat si proiecte speciale realizate in atelier, adaptate contextului fiecarui client.",
    "image": "/images/produse/bar-rustic-din-lemn/imagine-01-ansamblu.webp",
    "productCount": 3
  }
];

export const categoryMap: Record<string, CatalogCategory> = Object.fromEntries(
  categories.map((category) => [category.slug, category]),
) as Record<string, CatalogCategory>;

export function getCategoryBySlug(slug: string) {
  return categoryMap[slug];
}
