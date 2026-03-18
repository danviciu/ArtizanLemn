export type InquiryAttachment = {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
};

export type InquiryFormData = {
  nume: string;
  telefon: string;
  email: string;
  titluProiect: string;
  descriereDetaliata: string;
  dimensiuniAproximative?: string;
  spatiulFolosire?: string;
  bugetOrientativ?: string;
  termenDorit?: string;
  observatiiSuplimentare?: string;
  attachments: InquiryAttachment[];
};
