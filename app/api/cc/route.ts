import { NextRequest, NextResponse } from "next/server";
import {
  COOKIE_CONSENT_COOKIE_NAME,
  isCookieConsentDecision,
} from "@/lib/cookie-consent";

const CONSENT_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

function resolveRedirectTarget(request: NextRequest) {
  const next = request.nextUrl.searchParams.get("next");
  if (next && next.startsWith("/")) {
    return new URL(next, request.nextUrl.origin);
  }

  const referer = request.headers.get("referer");
  if (!referer) {
    return new URL("/", request.nextUrl.origin);
  }

  try {
    const refererUrl = new URL(referer);
    if (refererUrl.origin === request.nextUrl.origin) {
      return refererUrl;
    }
  } catch {
    // Fallback below.
  }

  return new URL("/", request.nextUrl.origin);
}

export async function GET(request: NextRequest) {
  const decision = request.nextUrl.searchParams.get("d");
  const redirectTarget = resolveRedirectTarget(request);
  const response = NextResponse.redirect(redirectTarget);

  if (!isCookieConsentDecision(decision)) {
    return response;
  }

  response.cookies.set({
    name: COOKIE_CONSENT_COOKIE_NAME,
    value: decision,
    path: "/",
    maxAge: CONSENT_COOKIE_MAX_AGE_SECONDS,
    sameSite: "lax",
    secure: request.nextUrl.protocol === "https:",
    domain: ".artizanlemn.ro",
  });

  return response;
}
