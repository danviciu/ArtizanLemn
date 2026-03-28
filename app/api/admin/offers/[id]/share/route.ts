import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminSessionValidFromRequest } from "@/lib/admin/auth";
import { getPersistedAdminOfferById } from "@/lib/admin/offers-repository";
import { sendOfferToClient } from "@/lib/email/sendOfferToClient";
import { generateOfferPdf } from "@/lib/offers/pdf";
import { uploadOfferPdfAndCreateSignedUrl } from "@/lib/offers/pdf-storage";
import { createWhatsAppLinkToPhone } from "@/lib/site-config";

export const runtime = "nodejs";

const shareOfferSchema = z.object({
  channel: z.enum(["email", "whatsapp"], {
    message: "Canalul de trimitere nu este valid.",
  }),
  recipientEmail: z
    .string()
    .trim()
    .email("Emailul destinatarului nu este valid.")
    .optional()
    .or(z.literal("")),
});

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!isAdminSessionValidFromRequest(request)) {
    return NextResponse.json(
      {
        success: false,
        message: "Neautorizat.",
      },
      { status: 401 },
    );
  }

  try {
    const { id } = await context.params;
    const offer = await getPersistedAdminOfferById(id);

    if (!offer) {
      return NextResponse.json(
        {
          success: false,
          message: "Oferta nu a fost gasita.",
        },
        { status: 404 },
      );
    }

    const rawPayload = await request.json();
    const parsedPayload = shareOfferSchema.safeParse(rawPayload);

    if (!parsedPayload.success) {
      const firstMessage =
        parsedPayload.error.issues[0]?.message || "Datele trimise nu sunt valide.";

      return NextResponse.json(
        {
          success: false,
          message: firstMessage,
        },
        { status: 400 },
      );
    }

    const { bytes, fileName } = await generateOfferPdf(offer);
    const uploadedPdf = await uploadOfferPdfAndCreateSignedUrl({
      offer,
      fileName,
      pdfBytes: bytes,
    });

    if (parsedPayload.data.channel === "email") {
      const destinationEmail =
        parsedPayload.data.recipientEmail || offer.clientEmail || "";

      if (!destinationEmail) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Completeaza emailul clientului in oferta sau in campul de trimitere.",
          },
          { status: 400 },
        );
      }

      await sendOfferToClient({
        offer,
        recipientEmail: destinationEmail,
        pdfFileName: fileName,
        pdfBytes: bytes,
        downloadUrl: uploadedPdf.signedUrl,
      });

      return NextResponse.json({
        success: true,
        channel: "email",
        message: `Oferta a fost trimisa pe email la ${destinationEmail}.`,
        recipientEmail: destinationEmail,
        pdf: {
          path: uploadedPdf.path,
          downloadUrl: uploadedPdf.signedUrl,
          expiresInSeconds: uploadedPdf.signedUrlExpiresInSeconds,
        },
      });
    }

    const whatsappMessage = [
      `Buna, ${offer.client}!`,
      `Iti trimitem oferta ${offer.offerNumber} pentru proiectul "${offer.projectTitle}".`,
      `Valoare totala: ${new Intl.NumberFormat("ro-RO", { style: "currency", currency: offer.currency, maximumFractionDigits: 2 }).format(offer.total)}.`,
      `PDF oferta: ${uploadedPdf.signedUrl}`,
      "Daca esti de acord, revenim cu contractul si pasii pentru avans.",
    ].join("\n");

    const whatsappUrl = createWhatsAppLinkToPhone(offer.clientPhone, whatsappMessage);

    if (!whatsappUrl) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Numarul de telefon al clientului lipseste sau nu poate fi folosit pentru WhatsApp.",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      channel: "whatsapp",
      message: "Mesajul WhatsApp este pregatit cu link PDF securizat.",
      whatsappUrl,
      pdf: {
        path: uploadedPdf.path,
        downloadUrl: uploadedPdf.signedUrl,
        expiresInSeconds: uploadedPdf.signedUrlExpiresInSeconds,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Trimiterea ofertei nu a putut fi procesata momentan.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 },
    );
  }
}
