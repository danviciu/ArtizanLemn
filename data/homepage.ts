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
    description:
      "Paturi din lemn masiv, configurate pe dimensiunea camerei si stilul dormitorului tau.",
    image: categoryImage(
      "paturi",
      "/images/produse/pat-bogdan/imagine-01-ansamblu.webp",
    ),
    href: "/produse?categorie=paturi",
    ctaLabel: "Vezi exemple",
  },
  {
    id: "mese",
    title: "Mese",
    description:
      "Mese din lemn masiv pentru dining si lucru, adaptate pe dimensiuni reale de utilizare.",
    image: categoryImage(
      "mese",
      "/images/produse/masa-coman/imagine-01-ansamblu.webp",
    ),
    href: "/produse?categorie=mese",
    ctaLabel: "Vezi exemple",
  },
  {
    id: "biblioteci",
    title: "Biblioteci",
    description:
      "Biblioteci si rafturi din lemn masiv pentru depozitare clara si integrare eleganta in interior.",
    image: categoryImage(
      "biblioteci",
      "/images/produse/biblioteca-bucur/imagine-01-ansamblu.webp",
    ),
    href: "/produse?categorie=biblioteci",
    ctaLabel: "Vezi exemple",
  },
  {
    id: "dulapuri-de-baie",
    title: "Dulapuri de baie",
    description:
      "Dulapuri de baie din lemn tratat, realizate pentru umiditate si optimizare eficienta a spatiului.",
    image: categoryImage(
      "dulapuri-de-baie",
      "/images/produse/dulap-de-baie-comandau/imagine-01-ansamblu.webp",
    ),
    href: "/produse?categorie=dulapuri-de-baie",
    ctaLabel: "Vezi exemple",
  },
  {
    id: "riflaje",
    title: "Riflaje",
    description:
      "Riflaje din lemn pentru ritm arhitectural, delimitare vizuala si accent premium in spatiul tau.",
    image: categoryImage(
      "riflaje",
      "/images/produse/riflaj-panou/imagine-01-ansamblu.webp",
    ),
    href: "/produse?categorie=riflaje",
    ctaLabel: "Vezi exemple",
  },
  {
    id: "piese-personalizate",
    title: "Piese personalizate",
    description:
      "Proiecte complet personalizate pentru idei unicat, discutate direct cu atelierul nostru.",
    image: categoryImage(
      "piese-personalizate",
      "/images/produse/bar-rustic-din-lemn/imagine-01-ansamblu.webp",
    ),
    href: "/produse?categorie=piese-personalizate",
    ctaLabel: "Solicita oferta",
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
    id: "pas-1",
    title: "Trimiti ideea sau schita",
    description:
      "Ne poti trimite fotografii, schite simple si exemple de inspiratie pentru proiect.",
  },
  {
    id: "pas-2",
    title: "Discutam materialele si dimensiunile",
    description:
      "Validam proportiile, esenta lemnului si finisajele potrivite pentru spatiul tau.",
  },
  {
    id: "pas-3",
    title: "Primesti solutia si oferta",
    description:
      "Iti propunem directia tehnica si oferta, apoi stabilim pasii urmatori de executie.",
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
