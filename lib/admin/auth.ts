import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

export const ADMIN_SESSION_COOKIE_NAME = "artizan_admin_session";

const SESSION_TTL_SECONDS = 60 * 60 * 12;

type AdminAuthConfig = {
  username: string;
  password: string;
  secret: string;
};

type AdminSessionPayload = {
  sub: string;
  exp: number;
};

function toBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left, "utf8");
  const rightBuffer = Buffer.from(right, "utf8");

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function signValue(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function getTrimmedEnvVar(name: string) {
  return process.env[name]?.trim() ?? "";
}

function getAdminAuthConfig(): AdminAuthConfig | null {
  const username = getTrimmedEnvVar("ADMIN_USERNAME");
  const password = getTrimmedEnvVar("ADMIN_PASSWORD");
  const secret = getTrimmedEnvVar("ADMIN_AUTH_SECRET");

  if (!username || !password || !secret) {
    return null;
  }

  return {
    username,
    password,
    secret,
  };
}

export function getAdminAuthConfigError() {
  const missingVars = [
    "ADMIN_USERNAME",
    "ADMIN_PASSWORD",
    "ADMIN_AUTH_SECRET",
  ].filter((name) => !getTrimmedEnvVar(name));

  if (!missingVars.length) {
    return null;
  }

  return `Configuratia de autentificare admin lipseste. Completeaza: ${missingVars.join(", ")}.`;
}

export function sanitizeAdminRedirectPath(nextPath?: string) {
  if (!nextPath) {
    return "/admin";
  }

  const trimmed = nextPath.trim();
  if (!trimmed.startsWith("/")) {
    return "/admin";
  }

  if (trimmed.startsWith("//")) {
    return "/admin";
  }

  if (!trimmed.startsWith("/admin")) {
    return "/admin";
  }

  return trimmed;
}

export function verifyAdminCredentials(username: string, password: string) {
  const config = getAdminAuthConfig();
  if (!config) {
    return {
      success: false as const,
      message: getAdminAuthConfigError() ?? "Configuratie admin incompleta.",
      statusCode: 500,
    };
  }

  const hasValidUsername = safeEqual(username.trim(), config.username);
  const hasValidPassword = safeEqual(password, config.password);

  if (!hasValidUsername || !hasValidPassword) {
    return {
      success: false as const,
      message: "Credentiale invalide.",
      statusCode: 401,
    };
  }

  return {
    success: true as const,
    username: config.username,
  };
}

export function createAdminSessionToken(subject: string) {
  const config = getAdminAuthConfig();
  if (!config) {
    throw new Error(getAdminAuthConfigError() ?? "Configuratie admin incompleta.");
  }

  const expiresAtMs = Date.now() + SESSION_TTL_SECONDS * 1000;
  const payload: AdminSessionPayload = {
    sub: subject,
    exp: expiresAtMs,
  };
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = signValue(encodedPayload, config.secret);

  return {
    token: `${encodedPayload}.${signature}`,
    expiresAtMs,
  };
}

function parseSessionPayload(encodedPayload: string): AdminSessionPayload | null {
  try {
    const parsed = JSON.parse(fromBase64Url(encodedPayload)) as Partial<AdminSessionPayload>;
    if (typeof parsed?.sub !== "string" || typeof parsed?.exp !== "number") {
      return null;
    }

    return {
      sub: parsed.sub,
      exp: parsed.exp,
    };
  } catch {
    return null;
  }
}

export function isAdminSessionTokenValid(token: string) {
  const config = getAdminAuthConfig();
  if (!config || !token) {
    return false;
  }

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) {
    return false;
  }

  const expectedSignature = signValue(encodedPayload, config.secret);
  if (!safeEqual(signature, expectedSignature)) {
    return false;
  }

  const payload = parseSessionPayload(encodedPayload);
  if (!payload) {
    return false;
  }

  return Date.now() < payload.exp;
}

export function isAdminSessionValidFromRequest(request: NextRequest | Request) {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) {
    return false;
  }

  const cookieName = `${ADMIN_SESSION_COOKIE_NAME}=`;
  const entry = cookieHeader
    .split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith(cookieName));

  if (!entry) {
    return false;
  }

  const token = decodeURIComponent(entry.slice(cookieName.length));
  return isAdminSessionTokenValid(token);
}

export function getAdminSessionCookieOptions(expiresAtMs: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(expiresAtMs),
    maxAge: SESSION_TTL_SECONDS,
  };
}

export function getClearedAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  };
}
