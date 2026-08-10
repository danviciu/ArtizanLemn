import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message:
        "Comenzile directe sunt dezactivate momentan. Trimite o cerere pentru oferta personalizata.",
    },
    { status: 410 },
  );
}
