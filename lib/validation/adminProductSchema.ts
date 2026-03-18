import { z } from "zod";
import { categories } from "@/data/categories";

const categorySlugs = categories.map((category) => category.slug);
const statusValues = ["activ", "draft", "arhivat"] as const;

const listItemSchema = z
  .string()
  .trim()
  .min(1, "Elementul listei nu poate fi gol.")
  .max(180, "Elementul listei este prea lung.");

const listSchema = z.array(listItemSchema).max(30, "Lista este prea lunga.");

export const adminProductPayloadSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Titlul trebuie sa aiba minimum 3 caractere.")
    .max(180, "Titlul este prea lung."),
  slug: z
    .string()
    .trim()
    .min(2, "Slug-ul este obligatoriu.")
    .max(180, "Slug-ul este prea lung.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug-ul trebuie sa contina litere mici, cifre si cratime.",
    ),
  category: z
    .string()
    .trim()
    .refine(
      (value) => categorySlugs.includes(value),
      "Categoria selectata nu este valida.",
    ),
  status: z.enum(statusValues, {
    message: "Statusul produsului nu este valid.",
  }),
  shortDescription: z
    .string()
    .trim()
    .min(12, "Descrierea scurta trebuie sa fie mai explicita.")
    .max(600, "Descrierea scurta este prea lunga."),
  fullDescription: z
    .string()
    .trim()
    .min(40, "Descrierea completa trebuie sa contina mai multe detalii.")
    .max(8000, "Descrierea completa este prea lunga."),
  featuredImage: z
    .string()
    .trim()
    .min(1, "Imaginea principala este obligatorie.")
    .max(500, "Calea imaginii principale este prea lunga."),
  gallery: listSchema,
  tags: listSchema,
  woodTypes: listSchema,
  finishes: listSchema,
  suitableFor: listSchema,
  isFeatured: z.boolean().default(false),
});

export type AdminProductPayload = z.infer<typeof adminProductPayloadSchema>;

export function parseCommaSeparatedList(rawValue: string) {
  return rawValue
    .split(",")
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}
