import { z } from "zod";

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".pdf"] as const;
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
] as const;

export const inquiryUploadConstraints = {
  maxFiles: 8,
  maxFileSizeBytes: 10 * 1024 * 1024,
  allowedExtensions: ALLOWED_EXTENSIONS,
  allowedMimeTypes: ALLOWED_MIME_TYPES,
} as const;

const optionalText = (max: number, tooLongMessage: string) =>
  z.string().trim().max(max, tooLongMessage).optional().or(z.literal(""));

export const inquirySchema = z.object({
  nume: z
    .string()
    .trim()
    .min(2, "Te rugam sa completezi numele.")
    .max(120, "Numele este prea lung."),
  telefon: z
    .string()
    .trim()
    .min(8, "Te rugam sa completezi un numar de telefon valid.")
    .max(30, "Numarul de telefon este prea lung."),
  email: z
    .string()
    .trim()
    .email("Te rugam sa completezi o adresa de email valida."),
  titluProiect: z
    .string()
    .trim()
    .min(3, "Adauga un titlu scurt pentru proiect.")
    .max(180, "Titlul proiectului este prea lung."),
  descriereDetaliata: z
    .string()
    .trim()
    .min(30, "Descrierea trebuie sa contina mai multe detalii.")
    .max(5000, "Descrierea este prea lunga."),
  dimensiuniAproximative: optionalText(
    1000,
    "Dimensiunile aproximative sunt prea lungi.",
  ),
  spatiulFolosire: optionalText(1000, "Campul despre spatiu este prea lung."),
  bugetOrientativ: optionalText(200, "Bugetul orientativ este prea lung."),
  termenDorit: optionalText(200, "Termenul dorit este prea lung."),
  observatiiSuplimentare: optionalText(
    1500,
    "Observatiile suplimentare sunt prea lungi.",
  ),
});

export type InquirySchemaValues = z.infer<typeof inquirySchema>;

export type InquiryAttachmentFileLike = {
  name: string;
  size: number;
  type: string;
};

function getLowercaseExtension(fileName: string) {
  const dotIndex = fileName.lastIndexOf(".");
  if (dotIndex === -1) {
    return "";
  }

  return fileName.slice(dotIndex).toLowerCase();
}

export function validateInquiryAttachments(files: InquiryAttachmentFileLike[]) {
  const errors: string[] = [];

  if (files.length > inquiryUploadConstraints.maxFiles) {
    errors.push(
      `Poti incarca maximum ${inquiryUploadConstraints.maxFiles} fisiere per cerere.`,
    );
  }

  files.forEach((file) => {
    const extension = getLowercaseExtension(file.name);
    const isAllowedExtension =
      inquiryUploadConstraints.allowedExtensions.includes(
        extension as (typeof ALLOWED_EXTENSIONS)[number],
      );
    const isAllowedMime =
      file.type === ""
        ? true
        : inquiryUploadConstraints.allowedMimeTypes.includes(
            file.type.toLowerCase() as (typeof ALLOWED_MIME_TYPES)[number],
          );

    if (!isAllowedExtension || !isAllowedMime) {
      errors.push(
        `${file.name}: format neacceptat. Formate permise: JPG, JPEG, PNG, WEBP, PDF.`,
      );
    }

    if (file.size > inquiryUploadConstraints.maxFileSizeBytes) {
      const maxMb = Math.floor(
        inquiryUploadConstraints.maxFileSizeBytes / (1024 * 1024),
      );
      errors.push(`${file.name}: fisierul depaseste limita de ${maxMb} MB.`);
    }
  });

  return errors;
}
