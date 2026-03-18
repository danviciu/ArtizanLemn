import { NextResponse } from "next/server";
import { updatePersistedAdminProduct } from "@/lib/admin/products-repository";
import { isAdminSessionValidFromRequest } from "@/lib/admin/auth";
import { adminProductPayloadSchema } from "@/lib/validation/adminProductSchema";

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
    const parsed = adminProductPayloadSchema.safeParse(payload);

    if (!parsed.success) {
      const flattened = parsed.error.flatten();

      return NextResponse.json(
        {
          success: false,
          message: "Datele produsului nu sunt valide.",
          fieldErrors: mapFieldErrors(flattened.fieldErrors),
          formErrors: flattened.formErrors,
        },
        { status: 400 },
      );
    }

    const product = await updatePersistedAdminProduct(id, parsed.data);

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Produsul nu a putut fi actualizat momentan.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 },
    );
  }
}
