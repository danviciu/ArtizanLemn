import { NextResponse } from "next/server";
import { isAdminSessionValidFromRequest } from "@/lib/admin/auth";
import { updatePersistedAdminOffer } from "@/lib/admin/offers-repository";
import { adminOfferPayloadSchema } from "@/lib/validation/adminOfferSchema";

export const runtime = "nodejs";

function mapFieldErrors(
  fieldErrors: Record<string, string[] | undefined>,
): Record<string, string[]> {
  return Object.fromEntries(
    Object.entries(fieldErrors).filter(
      (entry): entry is [string, string[]] =>
        Array.isArray(entry[1]) && entry[1].length > 0,
    ),
  );
}

export async function PATCH(
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
    const payload = await request.json();
    const parsed = adminOfferPayloadSchema.safeParse(payload);

    if (!parsed.success) {
      const flattened = parsed.error.flatten();

      return NextResponse.json(
        {
          success: false,
          message: "Datele ofertei nu sunt valide.",
          fieldErrors: mapFieldErrors(flattened.fieldErrors),
          formErrors: flattened.formErrors,
        },
        { status: 400 },
      );
    }

    const offer = await updatePersistedAdminOffer(id, parsed.data);

    return NextResponse.json({
      success: true,
      offer,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Oferta nu a putut fi actualizata momentan.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 },
    );
  }
}
