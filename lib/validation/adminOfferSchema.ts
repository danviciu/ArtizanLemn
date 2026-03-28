import { z } from "zod";
import { categories } from "@/data/categories";

const categorySlugs = categories.map((category) => category.slug);
const offerStatusValues = ["draft", "trimisa", "acceptata", "respinsa", "expirata"] as const;
const currencyValues = ["RON", "EUR"] as const;

const optionalTrimmedText = (max: number, message: string) =>
  z.string().trim().max(max, message).optional().or(z.literal(""));
const optionalEmail = z
  .string()
  .trim()
  .email("Emailul clientului nu este valid.")
  .optional()
  .or(z.literal(""));

export const adminOfferPayloadSchema = z
  .object({
    inquiryId: z
      .string()
      .trim()
      .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i, {
        message: "ID-ul cererii trebuie sa fie UUID valid.",
      })
      .optional()
      .or(z.literal("")),
    offerNumber: optionalTrimmedText(80, "Numarul ofertei este prea lung."),
    version: z
      .number({ message: "Versiunea trebuie sa fie numar." })
      .int("Versiunea trebuie sa fie un numar intreg.")
      .min(1, "Versiunea minima este 1.")
      .max(99, "Versiunea este prea mare."),
    client: z
      .string()
      .trim()
      .min(2, "Numele clientului este obligatoriu.")
      .max(150, "Numele clientului este prea lung."),
    clientPhone: z
      .string()
      .trim()
      .min(8, "Telefonul clientului este obligatoriu.")
      .max(30, "Telefonul clientului este prea lung."),
    clientEmail: optionalEmail,
    projectTitle: z
      .string()
      .trim()
      .min(3, "Titlul proiectului este obligatoriu.")
      .max(220, "Titlul proiectului este prea lung."),
    categorySlug: z
      .string()
      .trim()
      .refine((value) => value === "" || categorySlugs.includes(value), {
        message: "Categoria selectata nu este valida.",
      })
      .optional()
      .or(z.literal("")),
    currency: z.enum(currencyValues, {
      message: "Moneda selectata nu este valida.",
    }),
    subtotal: z
      .number({ message: "Subtotalul trebuie sa fie numar." })
      .min(0, "Subtotalul nu poate fi negativ.")
      .max(99999999, "Subtotalul este prea mare."),
    discountValue: z
      .number({ message: "Discountul trebuie sa fie numar." })
      .min(0, "Discountul nu poate fi negativ.")
      .max(99999999, "Discountul este prea mare."),
    tvaValue: z
      .number({ message: "TVA-ul trebuie sa fie numar." })
      .min(0, "TVA-ul nu poate fi negativ.")
      .max(99999999, "TVA-ul este prea mare."),
    validUntil: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: "Data de valabilitate trebuie sa fie in format YYYY-MM-DD.",
      }),
    estimatedExecutionDays: z
      .number({ message: "Termenul de executie trebuie sa fie numar." })
      .int("Termenul de executie trebuie sa fie un numar intreg.")
      .min(1, "Termenul minim este de 1 zi.")
      .max(3650, "Termenul de executie este prea mare.")
      .optional()
      .or(z.literal(0)),
    status: z.enum(offerStatusValues, {
      message: "Statusul ofertei nu este valid.",
    }),
    paymentTerms: optionalTrimmedText(2000, "Conditiile de plata sunt prea lungi."),
    warrantyMonths: z
      .number({ message: "Garantia trebuie sa fie numar." })
      .int("Garantia trebuie sa fie numar intreg.")
      .min(0, "Garantia nu poate fi negativa.")
      .max(120, "Garantia este prea mare.")
      .optional()
      .or(z.literal(0)),
    internalNotes: optionalTrimmedText(4000, "Notele interne sunt prea lungi."),
  })
  .superRefine((payload, ctx) => {
    if (payload.discountValue > payload.subtotal) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Discountul nu poate depasi subtotalul.",
        path: ["discountValue"],
      });
    }
  });

export type AdminOfferPayload = z.infer<typeof adminOfferPayloadSchema>;
