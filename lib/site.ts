import type { Metadata } from "next";

export const siteConfig = {
  name: "Artizan Lemn",
  domain: "ArtizanLemn.ro",
  url: "https://www.artizanlemn.ro",
  locale: "ro_RO",
  description:
    "Mobilier premium din lemn masiv realizat la comanda. Artizan Lemn transforma ideile tale in piese unicat, cu accent pe rafinament, proportii si executie impecabila.",
  phone: "0751414637",
  email: "contact@artizanlemn.ro",
  city: "Strada 1, Prejmer, Bra\u0219ov",
  address: {
    streetAddress: "Strada 1",
    addressLocality: "Prejmer",
    addressRegion: "Bra\u0219ov",
    addressCountry: "RO",
  },
  openingHours: "Mo-Fr 09:00-18:00",
  googleBusinessProfileUrl: "https://maps.app.goo.gl/VCTUNxjfyy9WVqqNA",
} as const;

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
};

const defaultImage = "/images/hero/hero-main-table.png";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Artizan Lemn | Mobilier Premium din Lemn Masiv",
    template: "%s | Artizan Lemn",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: {
    canonical: "/",
  },
  keywords: [
    "mobilier lemn masiv",
    "mobilier la comanda",
    "mobilier premium",
    "artizan lemn",
    "mobilier personalizat",
    "amenajari interioare lemn",
  ],
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: "Artizan Lemn | Mobilier Premium din Lemn Masiv",
    description: siteConfig.description,
    url: "/",
    images: [
      {
        url: defaultImage,
        width: 1200,
        height: 630,
        alt: "Artizan Lemn - mobilier premium din lemn masiv",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Artizan Lemn",
    description: siteConfig.description,
    images: [defaultImage],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      },
      {
        url: "/favicon-48x48.png",
        sizes: "48x48",
        type: "image/png",
      },
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    shortcut: [
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export function createPageMetadata({
  title,
  description,
  path,
  image = defaultImage,
  keywords,
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      title,
      description,
      url: path,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${title} - ${siteConfig.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
