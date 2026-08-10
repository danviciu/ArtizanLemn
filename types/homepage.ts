export type HomeCategoryItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
  ctaLabel: "Vezi exemple" | "Solicita oferta";
};

export type RepresentativePiece = {
  id: string;
  title: string;
  description: string;
  tag: string;
  image: string;
  href: string;
};

export type HomeProcessStep = {
  id: string;
  title: string;
  description: string;
};

export type HomeGalleryItem = {
  id: string;
  title: string;
  image: string;
};

export type HomeValueProp = {
  id: string;
  title: string;
  description: string;
};
