import "server-only";
import { Resend } from "resend";
import { getNotificationEmails, getResendApiKey } from "@/lib/env";

const DEFAULT_EMAIL_FROM = "Artizan Lemn <onboarding@resend.dev>";

export type InquiryNotificationAttachment = {
  name: string;
  path: string;
  publicUrl: string;
  size: number;
  type: string;
};

export type InquiryNotificationPayload = {
  inquiryId: string;
  submissionDateIso: string;
  name: string;
  phone: string;
  email: string;
  projectTitle: string;
  description: string;
  dimensions?: string | null;
  roomType?: string | null;
  budget?: string | null;
  deadlineNote?: string | null;
  additionalNotes?: string | null;
  attachments: InquiryNotificationAttachment[];
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function fallbackText(value?: string | null) {
  return value && value.trim() ? value.trim() : "-";
}

function formatSubmissionDate(dateIso: string) {
  const date = new Date(dateIso);
  if (Number.isNaN(date.getTime())) {
    return dateIso;
  }

  return new Intl.DateTimeFormat("ro-RO", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Bucharest",
  }).format(date);
}

export async function sendInquiryNotification(payload: InquiryNotificationPayload) {
  const resend = new Resend(getResendApiKey());
  const toEmails = getNotificationEmails();
  const submittedAtLabel = formatSubmissionDate(payload.submissionDateIso);

  const attachmentTextBlock = payload.attachments.length
    ? payload.attachments
        .map((item, index) => `${index + 1}. ${item.name}\n${item.publicUrl}`)
        .join("\n\n")
    : "Fara atasamente";

  const attachmentHtmlBlock = payload.attachments.length
    ? `<ul>${payload.attachments
        .map(
          (item) =>
            `<li><a href="${escapeHtml(item.publicUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.name)}</a></li>`,
        )
        .join("")}</ul>`
    : "<p>Fara atasamente.</p>";

  const text = [
    "Noua cerere mobilier - Artizan Lemn",
    "",
    `ID cerere: ${payload.inquiryId}`,
    `Data trimiterii: ${submittedAtLabel}`,
    "",
    `Nume: ${payload.name}`,
    `Telefon: ${payload.phone}`,
    `Email: ${payload.email}`,
    `Titlu proiect: ${payload.projectTitle}`,
    "",
    "Descriere:",
    payload.description,
    "",
    `Dimensiuni: ${fallbackText(payload.dimensions)}`,
    `Spatiu: ${fallbackText(payload.roomType)}`,
    `Buget: ${fallbackText(payload.budget)}`,
    `Termen: ${fallbackText(payload.deadlineNote)}`,
    `Observatii: ${fallbackText(payload.additionalNotes)}`,
    "",
    "Atasamente:",
    attachmentTextBlock,
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #20150f;">
      <h2 style="margin: 0 0 12px;">Noua cerere mobilier - Artizan Lemn</h2>
      <p style="margin: 0 0 16px;">
        <strong>ID cerere:</strong> ${escapeHtml(payload.inquiryId)}<br />
        <strong>Data trimiterii:</strong> ${escapeHtml(submittedAtLabel)}
      </p>
      <p style="margin: 0 0 4px;"><strong>Nume:</strong> ${escapeHtml(payload.name)}</p>
      <p style="margin: 0 0 4px;"><strong>Telefon:</strong> ${escapeHtml(payload.phone)}</p>
      <p style="margin: 0 0 4px;"><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
      <p style="margin: 0 0 16px;"><strong>Titlu proiect:</strong> ${escapeHtml(payload.projectTitle)}</p>

      <h3 style="margin: 0 0 8px;">Descriere</h3>
      <p style="margin: 0 0 16px; white-space: pre-wrap;">${escapeHtml(payload.description)}</p>

      <h3 style="margin: 0 0 8px;">Detalii suplimentare</h3>
      <p style="margin: 0 0 4px;"><strong>Dimensiuni:</strong> ${escapeHtml(fallbackText(payload.dimensions))}</p>
      <p style="margin: 0 0 4px;"><strong>Spatiu:</strong> ${escapeHtml(fallbackText(payload.roomType))}</p>
      <p style="margin: 0 0 4px;"><strong>Buget:</strong> ${escapeHtml(fallbackText(payload.budget))}</p>
      <p style="margin: 0 0 4px;"><strong>Termen:</strong> ${escapeHtml(fallbackText(payload.deadlineNote))}</p>
      <p style="margin: 0 0 16px;"><strong>Observatii:</strong> ${escapeHtml(fallbackText(payload.additionalNotes))}</p>

      <h3 style="margin: 0 0 8px;">Atasamente</h3>
      ${attachmentHtmlBlock}
    </div>
  `;

  const { error } = await resend.emails.send({
    from: DEFAULT_EMAIL_FROM,
    to: toEmails,
    replyTo: payload.email,
    subject: "Noua cerere mobilier - Artizan Lemn",
    text,
    html,
  });

  if (error) {
    throw new Error(error.message || "Trimiterea notificarii email a esuat.");
  }
}
