import "server-only";
import { Resend } from "resend";
import { getNotificationEmailFrom, getResendApiKey } from "@/lib/env";
import type { AdminOffer } from "@/types/admin";

type SendOfferToClientPayload = {
  offer: AdminOffer;
  recipientEmail: string;
  pdfFileName: string;
  pdfBytes: Uint8Array;
  downloadUrl?: string;
};

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value || "-";
  }

  return new Intl.DateTimeFormat("ro-RO", {
    dateStyle: "long",
    timeZone: "Europe/Bucharest",
  }).format(date);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function sendOfferToClient(payload: SendOfferToClientPayload) {
  const resend = new Resend(getResendApiKey());
  const fromEmail = getNotificationEmailFrom();

  const subject = `Oferta ${payload.offer.offerNumber} - ${payload.offer.projectTitle}`;
  const totalLabel = formatCurrency(payload.offer.total, payload.offer.currency);
  const validUntilLabel = formatDate(payload.offer.validUntil);
  const paymentTerms =
    payload.offer.paymentTerms ||
    "Detaliile de plata sunt cele discutate cu consultantul Artizan Lemn.";

  const textLines = [
    `Buna, ${payload.offer.client},`,
    "",
    "Iti trimitem oferta comerciala in format PDF, atasata acestui email.",
    "",
    `Numar oferta: ${payload.offer.offerNumber}`,
    `Proiect: ${payload.offer.projectTitle}`,
    `Total: ${totalLabel}`,
    `Valabila pana la: ${validUntilLabel}`,
    "",
    `Conditii plata: ${paymentTerms}`,
    "",
    payload.downloadUrl
      ? `Link securizat PDF (backup): ${payload.downloadUrl}`
      : "",
    "",
    "Multumim,",
    "Echipa Artizan Lemn",
  ].filter(Boolean);

  const html = `
    <div style="font-family: Arial, sans-serif; color: #2b1f17; line-height: 1.6;">
      <h2 style="margin: 0 0 10px;">Oferta comerciala Artizan Lemn</h2>
      <p style="margin: 0 0 16px;">Buna, ${escapeHtml(payload.offer.client)},</p>
      <p style="margin: 0 0 16px;">
        Iti trimitem oferta comerciala in format PDF, atasata acestui email.
      </p>
      <table style="border-collapse: collapse; width: 100%; max-width: 560px; margin: 0 0 16px;">
        <tbody>
          <tr>
            <td style="border: 1px solid #d8ccc1; padding: 8px; font-weight: 600;">Numar oferta</td>
            <td style="border: 1px solid #d8ccc1; padding: 8px;">${escapeHtml(payload.offer.offerNumber)}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #d8ccc1; padding: 8px; font-weight: 600;">Proiect</td>
            <td style="border: 1px solid #d8ccc1; padding: 8px;">${escapeHtml(payload.offer.projectTitle)}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #d8ccc1; padding: 8px; font-weight: 600;">Total</td>
            <td style="border: 1px solid #d8ccc1; padding: 8px;">${escapeHtml(totalLabel)}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #d8ccc1; padding: 8px; font-weight: 600;">Valabilitate</td>
            <td style="border: 1px solid #d8ccc1; padding: 8px;">${escapeHtml(validUntilLabel)}</td>
          </tr>
        </tbody>
      </table>
      <p style="margin: 0 0 16px;">
        <strong>Conditii de plata:</strong> ${escapeHtml(paymentTerms)}
      </p>
      ${
        payload.downloadUrl
          ? `<p style="margin: 0 0 16px;">Link securizat PDF (backup): <a href="${escapeHtml(payload.downloadUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(payload.downloadUrl)}</a></p>`
          : ""
      }
      <p style="margin: 0;">Multumim,<br />Echipa Artizan Lemn</p>
    </div>
  `;

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: [payload.recipientEmail],
    replyTo: "contact@artizanlemn.ro",
    subject,
    text: textLines.join("\n"),
    html,
    attachments: [
      {
        filename: payload.pdfFileName,
        content: Buffer.from(payload.pdfBytes).toString("base64"),
      },
    ],
  });

  if (error) {
    throw new Error(error.message || "Trimiterea emailului cu oferta a esuat.");
  }
}
