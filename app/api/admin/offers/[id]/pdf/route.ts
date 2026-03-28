import { NextResponse } from "next/server";
import { isAdminSessionValidFromRequest } from "@/lib/admin/auth";
import { getPersistedAdminOfferById } from "@/lib/admin/offers-repository";
import { generateOfferPdf } from "@/lib/offers/pdf";

export const runtime = "nodejs";

export async function GET(
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

    const { bytes, fileName } = await generateOfferPdf(offer);

    return new NextResponse(Buffer.from(bytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "PDF-ul ofertei nu a putut fi generat momentan.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 },
    );
  }
}
