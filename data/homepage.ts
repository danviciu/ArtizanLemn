import type {
  HomeCategoryItem,
  HomeGalleryItem,
  HomeProcessStep,
  HomeValueProp,
  RepresentativePiece,
} from "@/types/homepage";
import { getCategoryBySlug } from "@/data/categories";
import { getProductBySlug } from "@/data/products";

function categoryImage(slug: string, fallback: string) {
  return getCategoryBySlug(slug)?.image ?? fallback;
}

function productImage(slug: string, fallback: string) {
  return getProductBySlug(slug)?.featuredImage ?? fallback;
}

export const homeCategories: HomeCategoryItem[] = [
  {
    id: "paturi",
    title: "Paturi",
    description: "Structuri solide, proportii echilibrate si finisaje premium.",
    image: categoryImage(
      "paturi",
      "/images/produse/pat-bogdan/imagine-01-ansamblu.webp",
    ),
    href: "/produse?categorie=paturi",
  },
  {
    id: "mese",
    title: "Mese",
    description: "Piese centrale pentru dining si living, construite sa reziste.",
    image: categoryImage(
      "mese",
      "/images/produse/masa-coman/imagine-01-ansamblu.webp",
    ),
    href: "/produse?categorie=mese",
  },
  {
    id: "biblioteci",
    title: "Biblioteci",
    description: "Compozitii personalizate pentru carti si obiecte.",
    image: categoryImage(
      "biblioteci",
      "/images/produse/biblioteca-bucur/imagine-01-ansamblu.webp",
    ),
    href: "/produse?categorie=biblioteci",
  },
  {
    id: "dulapuri-de-baie",
    title: "Dulapuri de baie",
    description: "Depozitare eficienta cu integrare eleganta in amenajare.",
    image: categoryImage(
      "dulapuri-de-baie",
      "/images/produse/dulap-de-baie-comandau/imagine-01-ansamblu.webp",
    ),
    href: "/produse?categorie=dulapuri-de-baie",
  },
  {
    id: "riflaje",
    title: "Riflaje",
    description: "Detalii arhitecturale cu textura si ritm vizual rafinat.",
    image: categoryImage(
      "riflaje",
      "/images/produse/riflaj-panou/imagine-01-ansamblu.webp",
    ),
    href: "/produse?categorie=riflaje",
  },
  {
    id: "piese-personalizate",
    title: "Piese personalizate",
    description: "Solutii unicat pentru idei care nu intra in tipare standard.",
    image: categoryImage(
      "piese-personalizate",
      "/images/produse/bar-rustic-din-lemn/imagine-01-ansamblu.webp",
    ),
    href: "/produse?categorie=piese-personalizate",
  },
];

export const representativePieces: RepresentativePiece[] = [
  {
    id: "masa-coman",
    title: "Masa Coman",
    description:
      "Masa dining din stejar, cu volum puternic si detalii de finisaj curate.",
    tag: "lemn masiv",
    image: productImage("masa-coman", "/images/produse/masa-coman/imagine-01-ansamblu.webp"),
    href: "/produse/masa-coman",
  },
  {
    id: "pat-daniela",
    title: "Pat Daniela",
    description: "Cadru premium pentru dormitor, proiectat pe dimensiuni reale.",
    tag: "la comanda",
    image: productImage(
      "pat-daniela",
      "/images/produse/pat-daniela/imagine-01-ansamblu.webp",
    ),
    href: "/produse/pat-daniela",
  },
  {
    id: "biblioteca-bucur",
    title: "Biblioteca Bucur",
    description:
      "Compozitie modulara pentru living, cu ritm vizual si functionalitate.",
    tag: "executie premium",
    image: productImage(
      "biblioteca-bucur",
      "/images/produse/biblioteca-bucur/imagine-01-ansamblu.webp",
    ),
    href: "/produse/biblioteca-bucur",
  },
  {
    id: "dulap-de-baie-ramona",
    title: "Dulap de baie Ramona",
    description:
      "Mobilier compact tratat pentru umiditate, adaptat perfect pe spatiu.",
    tag: "solutie personalizata",
    image: productImage(
      "dulap-de-baie-ramona",
      "/images/produse/dulap-de-baie-ramona/imagine-01-ansamblu.webp",
    ),
    href: "/produse/dulap-de-baie-ramona",
  },
  {
    id: "panou-riflat",
    title: "Panou riflat",
    description: "Element decorativ care ordoneaza vizual zona de zi.",
    tag: "atelier artizanal",
    image: productImage(
      "riflaj-panou",
      "/images/produse/riflaj-panou/imagine-01-ansamblu.webp",
    ),
    href: "/produse/riflaj-panou",
  },
  {
    id: "usa-din-lemn",
    title: "Usa din lemn",
    description: "Tamplarie din lemn masiv, cu prezenta puternica si finisaj atent.",
    tag: "detaliu de finete",
    image: productImage("usa-din-lemn", "/images/produse/usa-din-lemn/imagine-01-ansamblu.webp"),
    href: "/produse/usa-din-lemn",
  },
];

export const homeProcessSteps: HomeProcessStep[] = [
  {
    id: "idee",
    title: "Ne trimiti ideea",
    description: "Descrii liber proiectul, cu schite, imagini sau exemple.",
  },
  {
    id: "discutie",
    title: "Discutam detaliile",
    description: "Stabilim materialele, proportiile si directia de executie.",
  },
  {
    id: "atelier",
    title: "Realizam piesa in atelier",
    description: "Executam fiecare element cu control riguros al finisajelor.",
  },
  {
    id: "livrare",
    title: "Livram produsul final",
    description: "Montaj curat, ajustari finale si predare completa a lucrarii.",
  },
];

export const homeGalleryItems: HomeGalleryItem[] = [
  { id: "galerie-1", title: "Foisor premium", image: "/images/galerie/foisor-paul-b.png" },
  { id: "galerie-2", title: "Scara interioara", image: "/images/galerie/scara-adela.png" },
  { id: "galerie-3", title: "Masa cu banci", image: "/images/galerie/masa-cu-banci.png" },
  { id: "galerie-4", title: "Intrare si tamplarie", image: "/images/galerie/intrare-fereastra.png" },
  { id: "galerie-5", title: "Bar din lemn masiv", image: "/images/galerie/bar-rustic-lemn.png" },
  { id: "galerie-6", title: "Veranda panoramica", image: "/images/galerie/veranda-panoramica.png" },
];

export const homeValueProps: HomeValueProp[] = [
  {
    id: "lemn-masiv",
    title: "Lemn masiv selectat",
    description: "Folosim esente potrivite proiectului si mediului de utilizare.",
  },
  {
    id: "executie",
    title: "Executie atenta",
    description: "Controlam fiecare detaliu, de la structura pana la finisaj.",
  },
  {
    id: "personalizare",
    title: "Solutii personalizate",
    description: "Nu impunem sabloane. Fiecare piesa este construita pe context.",
  },
  {
    id: "finisaje",
    title: "Finisaje de calitate",
    description: "Textura, nuanta si protectia suprafetei sunt calibrate premium.",
  },
  {
    id: "dialog",
    title: "Dialog direct cu atelierul",
    description: "Comunici direct cu echipa care proiecteaza si executa piesele.",
  },
];
