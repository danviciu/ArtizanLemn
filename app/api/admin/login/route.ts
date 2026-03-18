import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE_NAME,
  createAdminSessionToken,
  getAdminSessionCookieOptions,
  sanitizeAdminRedirectPath,
  verifyAdminCredentials,
} from "@/lib/admin/auth";

export const runtime = "nodejs";

type AdminLoginPayload = {
  username?: string;
  password?: string;
  next?: string;
};

function normalizePayload(payload: AdminLoginPayload) {
  return {
    username: payload.username?.trim() ?? "",
    password: payload.password ?? "",
    next: payload.next,
  };
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as AdminLoginPayload;
    const normalizedPayload = normalizePayload(payload);
    const credentials = verifyAdminCredentials(
      normalizedPayload.username,
      normalizedPayload.password,
    );

    if (!credentials.success) {
      return NextResponse.json(
        {
          success: false,
          message: credentials.message,
        },
        { status: credentials.statusCode },
      );
    }

    const { token, expiresAtMs } = createAdminSessionToken(credentials.username);
    const redirectTo = sanitizeAdminRedirectPath(normalizedPayload.next);

    const response = NextResponse.json({
      success: true,
      redirectTo,
    });

    response.cookies.set(
      ADMIN_SESSION_COOKIE_NAME,
      token,
      getAdminSessionCookieOptions(expiresAtMs),
    );

    return response;
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Nu am putut procesa autentificarea acum.",
      },
      { status: 500 },
    );
  }
}
