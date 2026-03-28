import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFFont,
  type PDFPage,
} from "pdf-lib";
import { categories } from "@/data/categories";
import { companyDetails } from "@/data/navigation";
import { siteConfig } from "@/lib/site";
import type { AdminOffer } from "@/types/admin";

const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;
const MARGIN_X = 42;
const MARGIN_TOP = 40;
const MARGIN_BOTTOM = 52;
const CONTENT_WIDTH = A4_WIDTH - MARGIN_X * 2;
const HEADER_HEIGHT = 145;

const palette = {
  dark: rgb(0.14, 0.1, 0.08),
  accent: rgb(0.63, 0.47, 0.3),
  text: rgb(0.16, 0.12, 0.1),
  muted: rgb(0.42, 0.35, 0.3),
  border: rgb(0.84, 0.78, 0.72),
  surface: rgb(0.97, 0.95, 0.92),
} as const;

const OFFER_LEGAL_CLAUSES = [
  "Oferta este valabila exclusiv pana la data mentionata in document.",
  "Preturile includ manopera, materiale, finisajele agreate si TVA-ul comunicat in oferta.",
  "Termenul de executie este estimativ si poate varia in functie de confirmarile tehnice finale.",
  "Orice schimbare de dimensiuni, materiale sau finisaje dupa acceptare necesita recalcul comercial.",
  "Garantia comerciala acopera vicii de executie in conditiile de utilizare normala.",
  "Litigiile se solutioneaza pe cale amiabila, iar in subsidiar de instantele competente din Romania.",
] as const;

type GeneratedOfferPdf = {
  fileName: string;
  bytes: Uint8Array;
};

type DrawContext = {
  page: PDFPage;
  y: number;
};

function sanitizeFileName(value: string) {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "oferta";
}

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

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value || "-";
  }

  return new Intl.DateTimeFormat("ro-RO", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Bucharest",
  }).format(date);
}

function resolveCategoryName(categorySlug?: string) {
  if (!categorySlug) {
    return "Nespecificata";
  }

  const category = categories.find((item) => item.slug === categorySlug);
  return category?.name ?? categorySlug;
}

function wrapLine(text: string, font: PDFFont, size: number, maxWidth: number) {
  const normalized = text.trim().replace(/\s+/g, " ");
  if (!normalized) {
    return [""];
  }

  const words = normalized.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    const candidateWidth = font.widthOfTextAtSize(candidate, size);

    if (candidateWidth <= maxWidth || !currentLine) {
      currentLine = candidate;
      continue;
    }

    lines.push(currentLine);
    currentLine = word;
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number) {
  const paragraphs = text.split("\n");
  const lines: string[] = [];

  for (const paragraph of paragraphs) {
    const wrapped = wrapLine(paragraph, font, size, maxWidth);
    lines.push(...wrapped);
  }

  return lines;
}

async function embedLogo(pdfDoc: PDFDocument) {
  try {
    const logoPath = path.join(
      process.cwd(),
      "public",
      "images",
      "logo",
      "artizan-lemn-logo.png",
    );
    const logoBytes = await readFile(logoPath);
    return await pdfDoc.embedPng(logoBytes);
  } catch {
    return null;
  }
}

function drawFooter(
  page: PDFPage,
  regularFont: PDFFont,
  pageNumber: number,
  totalPages: number,
) {
  const footerY = 28;
  page.drawLine({
    start: { x: MARGIN_X, y: footerY + 12 },
    end: { x: A4_WIDTH - MARGIN_X, y: footerY + 12 },
    thickness: 0.8,
    color: palette.border,
  });

  const leftText = `Artizan Lemn | ${companyDetails.phones[0]} | ${companyDetails.email}`;
  page.drawText(leftText, {
    x: MARGIN_X,
    y: footerY,
    size: 8,
    font: regularFont,
    color: palette.muted,
  });

  const rightText = `Pagina ${pageNumber}/${totalPages}`;
  const rightTextWidth = regularFont.widthOfTextAtSize(rightText, 8);
  page.drawText(rightText, {
    x: A4_WIDTH - MARGIN_X - rightTextWidth,
    y: footerY,
    size: 8,
    font: regularFont,
    color: palette.muted,
  });
}

function drawSectionTitle(
  context: DrawContext,
  title: string,
  boldFont: PDFFont,
) {
  context.page.drawText(title.toUpperCase(), {
    x: MARGIN_X,
    y: context.y,
    size: 10,
    font: boldFont,
    color: palette.accent,
  });
  context.page.drawLine({
    start: { x: MARGIN_X, y: context.y - 5 },
    end: { x: A4_WIDTH - MARGIN_X, y: context.y - 5 },
    thickness: 1,
    color: palette.border,
  });
  context.y -= 19;
}

export async function generateOfferPdf(offer: AdminOffer): Promise<GeneratedOfferPdf> {
  const pdfDoc = await PDFDocument.create();
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const logo = await embedLogo(pdfDoc);

  const createdAtLabel = formatDateTime(offer.createdAt);
  const updatedAtLabel = formatDateTime(offer.updatedAt);
  const totalLabel = formatCurrency(offer.total, offer.currency);
  const fileName = `oferta-${sanitizeFileName(offer.offerNumber)}-v${offer.version}.pdf`;

  const firstPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
  let context: DrawContext = {
    page: firstPage,
    y: A4_HEIGHT - MARGIN_TOP,
  };

  const addPage = () => {
    const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
    context = {
      page,
      y: A4_HEIGHT - MARGIN_TOP,
    };
    page.drawText(`Oferta ${offer.offerNumber}`, {
      x: MARGIN_X,
      y: context.y,
      size: 11,
      font: boldFont,
      color: palette.text,
    });
    page.drawText(`v${offer.version}`, {
      x: A4_WIDTH - MARGIN_X - boldFont.widthOfTextAtSize(`v${offer.version}`, 10),
      y: context.y,
      size: 10,
      font: boldFont,
      color: palette.muted,
    });
    context.y -= 20;
  };

  const ensureSpace = (heightNeeded: number) => {
    if (context.y - heightNeeded < MARGIN_BOTTOM) {
      addPage();
    }
  };

  firstPage.drawRectangle({
    x: 0,
    y: A4_HEIGHT - HEADER_HEIGHT,
    width: A4_WIDTH,
    height: HEADER_HEIGHT,
    color: palette.dark,
  });
  firstPage.drawRectangle({
    x: 0,
    y: A4_HEIGHT - HEADER_HEIGHT,
    width: A4_WIDTH,
    height: 4,
    color: palette.accent,
  });

  if (logo) {
    const logoSize = 50;
    firstPage.drawImage(logo, {
      x: MARGIN_X,
      y: A4_HEIGHT - 98,
      width: logoSize,
      height: logoSize,
    });
  }

  firstPage.drawText(siteConfig.name, {
    x: MARGIN_X + (logo ? 62 : 0),
    y: A4_HEIGHT - 70,
    size: 20,
    font: boldFont,
    color: rgb(0.98, 0.96, 0.93),
  });
  firstPage.drawText("Atelier mobilier premium din lemn masiv", {
    x: MARGIN_X + (logo ? 62 : 0),
    y: A4_HEIGHT - 88,
    size: 9,
    font: regularFont,
    color: rgb(0.9, 0.86, 0.8),
  });

  const title = "OFERTA COMERCIALA";
  const subtitle = `${offer.offerNumber} | v${offer.version}`;
  const titleWidth = boldFont.widthOfTextAtSize(title, 24);
  const subtitleWidth = regularFont.widthOfTextAtSize(subtitle, 10);
  firstPage.drawText(title, {
    x: A4_WIDTH - MARGIN_X - titleWidth,
    y: A4_HEIGHT - 72,
    size: 24,
    font: boldFont,
    color: rgb(0.98, 0.96, 0.93),
  });
  firstPage.drawText(subtitle, {
    x: A4_WIDTH - MARGIN_X - subtitleWidth,
    y: A4_HEIGHT - 90,
    size: 10,
    font: regularFont,
    color: rgb(0.9, 0.86, 0.8),
  });

  context.y = A4_HEIGHT - HEADER_HEIGHT - 18;

  const introText = [
    `Client: ${offer.client}`,
    `Proiect: ${offer.projectTitle}`,
    `Valoare oferta: ${totalLabel}`,
  ].join(" | ");

  firstPage.drawRectangle({
    x: MARGIN_X,
    y: context.y - 26,
    width: CONTENT_WIDTH,
    height: 28,
    color: palette.surface,
    borderColor: palette.border,
    borderWidth: 1,
  });
  firstPage.drawText(introText, {
    x: MARGIN_X + 10,
    y: context.y - 16,
    size: 10,
    font: regularFont,
    color: palette.text,
  });
  context.y -= 42;

  const details = [
    { label: "Client", value: offer.client },
    { label: "Telefon client", value: offer.clientPhone || "-" },
    { label: "Email client", value: offer.clientEmail || "-" },
    { label: "Titlu proiect", value: offer.projectTitle },
    { label: "Categorie", value: resolveCategoryName(offer.categorySlug) },
    { label: "Valabilitate", value: formatDate(offer.validUntil) },
    {
      label: "Executie estimata",
      value: offer.estimatedExecutionDays ? `${offer.estimatedExecutionDays} zile` : "Nespecificat",
    },
    {
      label: "Garantie",
      value: offer.warrantyMonths ? `${offer.warrantyMonths} luni` : "Nespecificata",
    },
    { label: "Status comercial", value: offer.status },
    { label: "Data creare", value: createdAtLabel },
    { label: "Ultima actualizare", value: updatedAtLabel },
    { label: "Cod oferta", value: offer.offerNumber },
  ];

  ensureSpace(110);
  drawSectionTitle(context, "Date client si proiect", boldFont);

  const colGap = 12;
  const colWidth = (CONTENT_WIDTH - colGap) / 2;
  const cardHeight = 47;
  for (let index = 0; index < details.length; index += 2) {
    ensureSpace(cardHeight + 9);

    const row = details.slice(index, index + 2);
    row.forEach((item, columnIndex) => {
      const x = MARGIN_X + (colWidth + colGap) * columnIndex;
      const y = context.y - cardHeight;

      context.page.drawRectangle({
        x,
        y,
        width: colWidth,
        height: cardHeight,
        color: rgb(1, 1, 1),
        borderColor: palette.border,
        borderWidth: 1,
      });

      context.page.drawText(item.label.toUpperCase(), {
        x: x + 8,
        y: y + cardHeight - 13,
        size: 7,
        font: boldFont,
        color: palette.muted,
      });

      const wrappedValue = wrapText(item.value, regularFont, 10, colWidth - 16).slice(0, 2);
      wrappedValue.forEach((line, lineIndex) => {
        context.page.drawText(line, {
          x: x + 8,
          y: y + cardHeight - 27 - lineIndex * 11,
          size: 10,
          font: regularFont,
          color: palette.text,
        });
      });
    });

    context.y -= cardHeight + 9;
  }

  ensureSpace(110);
  drawSectionTitle(context, "Sinteza financiara", boldFont);

  const financialRows = [
    { label: "Subtotal", value: formatCurrency(offer.subtotal, offer.currency) },
    { label: "Discount", value: formatCurrency(offer.discountValue, offer.currency) },
    { label: "TVA", value: formatCurrency(offer.tvaValue, offer.currency) },
  ];

  const rowHeight = 28;
  for (const row of financialRows) {
    ensureSpace(rowHeight + 5);
    const boxY = context.y - rowHeight;
    context.page.drawRectangle({
      x: MARGIN_X,
      y: boxY,
      width: CONTENT_WIDTH,
      height: rowHeight,
      color: rgb(1, 1, 1),
      borderColor: palette.border,
      borderWidth: 1,
    });

    context.page.drawText(row.label, {
      x: MARGIN_X + 10,
      y: boxY + 10,
      size: 10,
      font: regularFont,
      color: palette.text,
    });

    const valueWidth = boldFont.widthOfTextAtSize(row.value, 10);
    context.page.drawText(row.value, {
      x: MARGIN_X + CONTENT_WIDTH - 10 - valueWidth,
      y: boxY + 10,
      size: 10,
      font: boldFont,
      color: palette.text,
    });

    context.y -= rowHeight + 5;
  }

  ensureSpace(42);
  const totalBoxHeight = 36;
  const totalBoxY = context.y - totalBoxHeight;
  context.page.drawRectangle({
    x: MARGIN_X,
    y: totalBoxY,
    width: CONTENT_WIDTH,
    height: totalBoxHeight,
    color: rgb(0.95, 0.92, 0.87),
    borderColor: palette.accent,
    borderWidth: 1,
  });
  context.page.drawText("TOTAL OFERTA", {
    x: MARGIN_X + 10,
    y: totalBoxY + 14,
    size: 12,
    font: boldFont,
    color: palette.text,
  });

  const totalWidth = boldFont.widthOfTextAtSize(totalLabel, 14);
  context.page.drawText(totalLabel, {
    x: MARGIN_X + CONTENT_WIDTH - 10 - totalWidth,
    y: totalBoxY + 12,
    size: 14,
    font: boldFont,
    color: palette.text,
  });
  context.y -= totalBoxHeight + 11;

  ensureSpace(100);
  drawSectionTitle(context, "Conditii comerciale", boldFont);

  const commercialLines = [
    `Conditii plata: ${offer.paymentTerms || "La confirmarea comenzii se stabileste calendarul de plata."}`,
    `Termen estimat executie: ${offer.estimatedExecutionDays ? `${offer.estimatedExecutionDays} zile` : "in functie de complexitate si disponibilitate materiale."}`,
    `Garantie comerciala: ${offer.warrantyMonths ? `${offer.warrantyMonths} luni` : "conform legislatiei aplicabile."}`,
    `Oferta este valabila pana la: ${formatDate(offer.validUntil)}.`,
  ];

  for (const line of commercialLines) {
    const wrapped = wrapText(line, regularFont, 10, CONTENT_WIDTH - 16);
    ensureSpace(wrapped.length * 12 + 8);
    wrapped.forEach((wrappedLine, lineIndex) => {
      context.page.drawText(lineIndex === 0 ? `- ${wrappedLine}` : `  ${wrappedLine}`, {
        x: MARGIN_X + 6,
        y: context.y - lineIndex * 12,
        size: 10,
        font: regularFont,
        color: palette.text,
      });
    });
    context.y -= wrapped.length * 12 + 4;
  }

  ensureSpace(120);
  drawSectionTitle(context, "Clauze legale esentiale", boldFont);

  for (const clause of OFFER_LEGAL_CLAUSES) {
    const wrapped = wrapText(clause, regularFont, 9, CONTENT_WIDTH - 16);
    ensureSpace(wrapped.length * 11 + 7);
    wrapped.forEach((wrappedLine, lineIndex) => {
      context.page.drawText(lineIndex === 0 ? `- ${wrappedLine}` : `  ${wrappedLine}`, {
        x: MARGIN_X + 6,
        y: context.y - lineIndex * 11,
        size: 9,
        font: regularFont,
        color: palette.text,
      });
    });
    context.y -= wrapped.length * 11 + 4;
  }

  ensureSpace(110);
  const signatureBoxHeight = 88;
  const signatureBoxY = context.y - signatureBoxHeight;
  context.page.drawRectangle({
    x: MARGIN_X,
    y: signatureBoxY,
    width: CONTENT_WIDTH,
    height: signatureBoxHeight,
    color: palette.surface,
    borderColor: palette.border,
    borderWidth: 1,
  });

  const signatureIntro =
    "Prin acceptarea acestei oferte, clientul confirma ca a revizuit conditiile comerciale si legale de mai sus.";
  const signatureIntroLines = wrapText(
    signatureIntro,
    regularFont,
    9,
    CONTENT_WIDTH - 20,
  ).slice(0, 2);
  signatureIntroLines.forEach((line, index) => {
    context.page.drawText(line, {
      x: MARGIN_X + 10,
      y: signatureBoxY + 64 - index * 11,
      size: 9,
      font: regularFont,
      color: palette.text,
    });
  });

  const leftLineY = signatureBoxY + 24;
  context.page.drawLine({
    start: { x: MARGIN_X + 12, y: leftLineY },
    end: { x: MARGIN_X + CONTENT_WIDTH / 2 - 12, y: leftLineY },
    thickness: 0.8,
    color: palette.border,
  });
  context.page.drawLine({
    start: { x: MARGIN_X + CONTENT_WIDTH / 2 + 12, y: leftLineY },
    end: { x: MARGIN_X + CONTENT_WIDTH - 12, y: leftLineY },
    thickness: 0.8,
    color: palette.border,
  });
  context.page.drawText("Semnatura client", {
    x: MARGIN_X + 12,
    y: leftLineY - 12,
    size: 8,
    font: regularFont,
    color: palette.muted,
  });
  context.page.drawText("Semnatura Artizan Lemn", {
    x: MARGIN_X + CONTENT_WIDTH / 2 + 12,
    y: leftLineY - 12,
    size: 8,
    font: regularFont,
    color: palette.muted,
  });

  const pages = pdfDoc.getPages();
  pages.forEach((page, index) => {
    drawFooter(page, regularFont, index + 1, pages.length);
  });

  const bytes = await pdfDoc.save();
  return {
    fileName,
    bytes,
  };
}
