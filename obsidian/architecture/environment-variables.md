---
tags: [architecture, config, stable]
updated: 2026-10-09
---

# Environment Variables

Rules for handling configuration and secrets.

## Rules

- Store all secrets in **`.env.local`** — never commit it (it is git-ignored).
- Document every required variable in **`.env.example`** (committed, no real values).
- Reference variables in code via `process.env.VARIABLE_NAME`.
- Prefix with **`NEXT_PUBLIC_`** only if the value is safe to expose to the browser.
  Unprefixed variables are server-only.

## Current variables

| Name | Scope | Purpose |
|------|-------|---------|
| `NEXT_PUBLIC_SITE_URL` | public, build-time | Canonical origin: `https://speakofthe.com` in production; `http://localhost:3003` for local smoke. Drives metadata and the reveal Origin check behind AWS proxies. Set before building. Falls back through the Vercel domain, then localhost. |
| `CONTACT_EMAIL` | server-only, runtime | Optional validated address read by `getContactEmail()` after a reveal request. Blank/unset returns 503; required as a GitHub production secret for deployment. No literal is committed. |
| `CONTACT_ENDPOINT` | server-only | Optional upstream for the separate, unused example `/api/contact` route. Without it there is no delivery; production strips its console log. |
| `VERCEL_PROJECT_PRODUCTION_URL` | server-only | Optional inherited metadata fallback; AWS uses the explicit canonical origin instead. |

Documented in `.env.example` (committed). Validated by `src/env.ts` (zod):
`publicEnv` for `NEXT_PUBLIC_*` (safe anywhere), `getServerEnv()` for
server-only secrets (route handlers only) — see [[api-architecture]]. Read env
through `src/env.ts`, never `process.env` directly.

> [!important] Secret handling
> Secret keys are **unprefixed** — `NEXT_PUBLIC_` is only for values safe in the
> browser. Secrets are read in server code (`app/api/**`); the browser never
> holds one. See [[api-architecture]].

When the next variable is introduced:
1. Add it to `.env.example` with a comment describing it.
2. Add a row to the table above (name, scope, purpose).
3. Add a [[changelog]] entry.

The owner selected the existing GitHub AWS credential secrets for deployment;
OIDC remains optional. No local credential inspection or AWS access preflight is
part of this preparation. For CI settings and deployment details, see
[[aws-deployment]]. `.env*` files are ignored except `.env.example`, and packaging
excludes them. The runtime address also resides in sensitive Terraform state and
plans: secure those artifacts and never put them in public S3 or Git.

## Related

[[tech-stack]] · [[seo-metadata]] · [[backend/README]]
