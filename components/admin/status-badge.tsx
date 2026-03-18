import type {
  AdminBlogStatus,
  AdminGalleryStatus,
  AdminInquiryStatus,
  AdminOrderStatus,
  AdminProductStatus,
} from "@/types/admin";
import { cn } from "@/lib/utils";

type StatusVariant =
  | "product"
  | "inquiry"
  | "order"
  | "gallery"
  | "blog";

type StatusValue =
  | AdminProductStatus
  | AdminInquiryStatus
  | AdminOrderStatus
  | AdminGalleryStatus
  | AdminBlogStatus;

type StatusBadgeProps = {
  variant: StatusVariant;
  value: StatusValue;
};

const styles = {
  neutral: "border-sand-300 bg-sand-100 text-wood-700",
  accent: "border-wood-900/30 bg-wood-900/10 text-wood-900",
  green: "border-emerald-700/25 bg-emerald-50 text-emerald-800",
  blue: "border-sky-700/25 bg-sky-50 text-sky-800",
  amber: "border-amber-700/25 bg-amber-50 text-amber-800",
  red: "border-rose-700/25 bg-rose-50 text-rose-800",
  violet: "border-violet-700/25 bg-violet-50 text-violet-800",
};

const productStatusMeta: Record<AdminProductStatus, { label: string; style: keyof typeof styles }> = {
  activ: { label: "Activ", style: "green" },
  draft: { label: "Draft", style: "neutral" },
  arhivat: { label: "Arhivat", style: "red" },
};

const inquiryStatusMeta: Record<AdminInquiryStatus, { label: string; style: keyof typeof styles }> = {
  nou: { label: "Nou", style: "amber" },
  in_analiza: { label: "In analiza", style: "blue" },
  contactat: { label: "Contactat", style: "accent" },
  oferta_trimisa: { label: "Oferta trimisa", style: "violet" },
  acceptata: { label: "Acceptata", style: "green" },
  respinsa: { label: "Respinsa", style: "red" },
  transformata_in_comanda: { label: "Transformata in comanda", style: "accent" },
};

const orderStatusMeta: Record<AdminOrderStatus, { label: string; style: keyof typeof styles }> = {
  confirmata: { label: "Confirmata", style: "amber" },
  in_proiectare: { label: "In proiectare", style: "blue" },
  in_executie: { label: "In executie", style: "accent" },
  finisare: { label: "Finisare", style: "violet" },
  pregatita_de_livrare: { label: "Pregatita de livrare", style: "blue" },
  livrata: { label: "Livrata", style: "green" },
  finalizata: { label: "Finalizata", style: "green" },
};

const galleryStatusMeta: Record<AdminGalleryStatus, { label: string; style: keyof typeof styles }> = {
  draft: { label: "Draft", style: "neutral" },
  publicat: { label: "Publicat", style: "green" },
  arhivat: { label: "Arhivat", style: "red" },
};

const blogStatusMeta: Record<AdminBlogStatus, { label: string; style: keyof typeof styles }> = {
  draft: { label: "Draft", style: "neutral" },
  in_review: { label: "In review", style: "amber" },
  publicat: { label: "Publicat", style: "green" },
  arhivat: { label: "Arhivat", style: "red" },
};

function resolveMeta(variant: StatusVariant, value: StatusValue) {
  if (variant === "product") return productStatusMeta[value as AdminProductStatus];
  if (variant === "inquiry") return inquiryStatusMeta[value as AdminInquiryStatus];
  if (variant === "order") return orderStatusMeta[value as AdminOrderStatus];
  if (variant === "gallery") return galleryStatusMeta[value as AdminGalleryStatus];
  return blogStatusMeta[value as AdminBlogStatus];
}

export function StatusBadge({ variant, value }: StatusBadgeProps) {
  const meta = resolveMeta(variant, value);

  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 text-xs font-medium",
        styles[meta.style],
      )}
    >
      {meta.label}
    </span>
  );
}

export const inquiryStatusOptions = Object.keys(
  inquiryStatusMeta,
) as AdminInquiryStatus[];

export const orderStatusOptions = Object.keys(orderStatusMeta) as AdminOrderStatus[];
