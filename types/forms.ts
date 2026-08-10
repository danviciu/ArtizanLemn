import type { MarketingAttributionData } from "@/types/marketing";

export type InquiryAttachment = {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
};

export type InquiryFormData = MarketingAttributionData & {
  nume: string;
  telefon: string;
  email: string;
  website?: string;
  titluProiect: string;
  descriereDetaliata: string;
  dimensiuniAproximative?: string;
  spatiulFolosire?: string;
  bugetOrientativ?: string;
  termenDorit?: string;
  observatiiSuplimentare?: string;
  attachments: InquiryAttachment[];
};
