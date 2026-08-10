import { z } from "zod";

const optionalText = (max: number) =>
  z.string().trim().max(max).optional().or(z.literal(""));

export const checkoutOrderSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Numele este obligatoriu.")
    .max(140, "Numele este prea lung."),
  phone: z
    .string()
    .trim()
    .min(8, "Telefonul este obligatoriu.")
    .max(30, "Telefonul este prea lung."),
  email: z
    .string()
    .trim()
    .email("Adresa de email nu este valida.")
    .max(180, "Adresa de email este prea lunga."),
  county: z
    .string()
    .trim()
    .min(2, "Judetul este obligatoriu.")
    .max(120, "Judetul este prea lung."),
  city: z
    .string()
    .trim()
    .min(2, "Localitatea este obligatorie.")
    .max(120, "Localitatea este prea lunga."),
  address: z
    .string()
    .trim()
    .min(5, "Adresa este obligatorie.")
    .max(400, "Adresa este prea lunga."),
  notes: optionalText(1500),
  deliveryMethod: z.enum(["curier", "ridicare_personala"], {
    message: "Metoda de livrare nu este valida.",
  }),
  paymentMethod: z.enum(["transfer_bancar", "ramburs"], {
    message: "Metoda de plata nu este valida.",
  }),
  acceptTerms: z.literal(true, {
    message: "Trebuie sa accepti termenii pentru a trimite comanda.",
  }),
  items: z
    .array(
      z.object({
        slug: z
          .string()
          .trim()
          .min(2, "Produs invalid.")
          .max(180, "Identificator produs prea lung."),
        quantity: z
          .coerce
          .number()
          .int("Cantitatea trebuie sa fie intreaga.")
          .min(1, "Cantitatea minima este 1.")
          .max(99, "Cantitatea maxima este 99."),
        sizeOptionId: optionalText(80).nullable().optional(),
      }),
    )
    .min(1, "Cosul nu poate fi gol.")
    .max(120, "Cosul contine prea multe pozitii."),
});

export type CheckoutOrderSchemaValues = z.infer<typeof checkoutOrderSchema>;
