# Technical audit - Artizan Lemn - 2026-05-14

Scope: `G:\site Radu\artizanlemn-app`.

## Executive summary

`artizanlemn-app` is a Next.js storefront/admin app using Supabase, Resend, public inquiry/order APIs, upload handling, and custom admin authentication. The main release blocker is dependency security: `npm audit --omit=dev` reports high-severity Next.js advisories for the currently pinned `next@16.1.6`. The second blocker is that build/lint/typecheck are not currently reliable release gates.

## Checks run

- `npm audit --omit=dev`
- `npm run lint` - timed out after 120s.
- `npm run build` - timed out after 180s.
- `npx tsc --noEmit --pretty false` - failed on generated `.next/dev/types` files.
- Manual review of admin auth, API routes, upload handling, env handling, CSP/security headers, and project configuration.

## Findings

### P0 - Upgrade Next.js / PostCSS before production exposure

`npm audit --omit=dev` reports 2 vulnerabilities:

- `next` high severity.
- transitive `postcss` moderate severity.

`package.json` pins:

```json
"next": "16.1.6",
"eslint-config-next": "16.1.6"
```

Audit output recommends a patched Next.js version outside the current pinned range.

Impact: reported advisory classes include DoS, SSRF, cache poisoning, XSS, request smuggling, and middleware/proxy bypass.

Recommended fix:

- Upgrade `next` and `eslint-config-next` together.
- Regenerate `package-lock.json`.
- Re-run `npm audit --omit=dev`, `npm run build`, and a browser smoke test.

### P1 - Build/lint/typecheck are not reliable release gates

Observed results:

- `npm run lint` timed out after 120s.
- `npm run build` timed out after 180s.
- `npx tsc --noEmit --pretty false` failed with:
  - `.next/dev/types/routes.d.ts(124,1): error TS1128`
  - `.next/dev/types/validator.ts(506,1): error TS1128`

Impact: changes can be deployed without a trustworthy validation step.

Recommended fix:

- Delete generated `.next` artifacts.
- Re-run `npm run build`.
- If the issue persists, isolate whether route type generation or static generation is hanging.
- Add a dedicated `typecheck` script after the generated type issue is resolved.

### P1 - Admin login lacks rate limiting / lockout

`app/api/admin/login/route.ts` accepts login POSTs and calls `verifyAdminCredentials` directly. There is no request throttling around failed login attempts.

Good existing controls:

- Admin session token is HMAC-signed.
- Cookie is `httpOnly`.
- Cookie uses `sameSite: "lax"`.
- Cookie is `secure` in production.
- Redirect target is sanitized to `/admin`.

Impact: brute force and credential stuffing attempts are only limited by infrastructure.

Recommended fix:

- Reuse the existing IP-hash rate-limit approach already used for inquiries.
- Add a dedicated admin login rate-limit bucket/table.
- Rate-limit by IP hash and optionally username.

### P1 - Production CSP is too permissive

`next.config.ts` sets useful global security headers, but `script-src` includes:

```txt
'unsafe-inline' 'unsafe-eval' blob:
```

Impact: if an injection bug reaches script context, the CSP will not meaningfully constrain execution.

Recommended fix:

- Split dev and production CSP.
- Remove `'unsafe-eval'` from production.
- Replace broad inline script allowance with hashes/nonces where possible.

### P2 - Upload validation should verify image contents

The admin product image upload route limits file count and size, sanitizes filenames, and restricts MIME/extensions. It should also validate file signatures/magic bytes before writing public files.

Impact: a disguised non-image may be stored in a public bucket if it matches an allowed MIME or extension.

Recommended fix:

- Validate magic bytes for JPEG/PNG/WEBP/AVIF/GIF.
- Prefer server-side re-encoding/resizing before public storage.
- Remove GIF support unless animated product images are required.

### P2 - Public order endpoint needs rate limiting

`app/api/orders/route.ts` validates request data and recalculates product prices server-side, which is good. It does not rate-limit public requests.

Impact: automated spam orders can create operational noise and storage load.

Recommended fix:

- Apply the same windowed IP-hash limiter used by `/api/inquiries`.
- Consider a honeypot field for checkout forms.

### P2 - Local production secrets exist in `.env.local`

`.env.local` contains production-sensitive values such as Supabase service role, Resend key, and admin credentials. The file is ignored by git, but still present locally.

Impact: accidental folder sharing, sync, or machine compromise leaks backend access.

Recommended fix:

- Rotate keys if this workspace has been shared or zipped.
- Use separate local/dev Supabase credentials where possible.
- Keep production secrets only in deployment secret storage.

## Positive controls observed

- Admin session tokens are signed with HMAC and have a 12-hour TTL.
- Admin cookies are `httpOnly`, `sameSite=lax`, and production `secure`.
- Admin API routes check `isAdminSessionValidFromRequest`.
- Inquiry endpoint has honeypot and rate limiting.
- Order endpoint recalculates prices server-side.
- Security headers include `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, CSP, and production HSTS.

## Recommended next actions

1. Upgrade Next.js/PostCSS and verify `npm audit --omit=dev` is clean.
2. Delete generated `.next` artifacts and restore reliable build/typecheck/lint.
3. Add admin login rate limiting.
4. Add public order rate limiting.
5. Tighten production CSP.
6. Strengthen upload content validation.
