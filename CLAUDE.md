# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`webapp-clinical` is the **doctor-facing, desktop-first webapp** of the MediCoreAI platform. Authenticated
doctors use it to **review leads** captured by the public intake app and to **validate the plan** the
recommendation agent suggested for each lead (approve / reject / edit).

It is the sibling of `frontend-clinical/webappmobile-clinical` (the public, mobile-first intake form) —
**same stack, same feature-sliced architecture** — but with two deliberate differences:

- **Desktop-first.** This is a clinician's console, not a phone form. Design and verify at desktop widths
  first. (The mobile app is the opposite.)
- **One backend only: the .NET API.** This app talks exclusively to `backend-clinical/MediCoreAI.Clinical`
  (`api/v1/auth`, `api/v1/leads`). It **never** calls the Python intake service (`leads-clinical-ai`) and
  **never** touches the database directly. (The mobile app is the mirror image: it talks only to Python.)

### Place in the `health-app` monorepo

| Path | Service | Role |
|---|---|---|
| `frontend-clinical/webapp-clinical` | **This app** — Next.js 16 | Doctor console: review leads + validate plans |
| `frontend-clinical/webappmobile-clinical` | Next.js 16 | Public, mobile-first intake form → creates leads |
| `backend-clinical/MediCoreAI.Clinical` | .NET 10 API (Clean Architecture) | **The only backend this app calls** — auth + leads |
| `backend-clinical/leads-clinical-ai` | FastAPI + agent | Owns the `intake` schema, runs the agent — this app never calls it |
| `database/` | PostgreSQL 16 schema + docs | Source of truth for the data model |

## Commands

```bash
npm run dev      # Dev server — http://localhost:3000
npm run build    # Production build
npm run start    # Serve the production build
npm run lint     # ESLint (flat config)
```

- Requires **Node.js 20.9+** (Next.js 16).
- **No test framework is set up yet.** If you add one, wire it into `package.json` and document it here.

## Stack notes (non-obvious)

- **Next.js 16 App Router + React 19**, TypeScript `strict`. Code lives under `src/`; import alias `@/*` → `src/*`.
- **React Compiler is ON** (`reactCompiler: true` in `next.config.ts`). Do **not** hand-add
  `useMemo`/`useCallback` — the compiler memoizes automatically. Keep components pure.
- **Tailwind CSS v4** via PostCSS (`@tailwindcss/postcss`), `@import "tailwindcss"` in
  `src/app/globals.css`. There is **no `tailwind.config.js`** — theme tokens live in the `@theme inline`
  block. The brand palette (navy / steel / sky, light + dark, clinical semantic colors) comes from the
  MediCoreAI design system and is shared with the mobile app.
- **shadcn/ui on Base UI** (not Radix). Add primitives with `npx shadcn@latest add <name> --primitive=base-ui`;
  they land in `src/shared/components/ui/` — don't hand-edit them. See the `nextjs-shadcn-baseui` skill for
  the shadcn conventions (Base UI engine, forms with react-hook-form + zod), but note that its **mobile-first**
  and **intake/Python** rules are for the mobile app and do **not** apply here.

## Data contract (read before wiring any request)

This app consumes **one** API surface: the .NET `MediCoreAI.Clinical` service. Reference the endpoint
contracts in `../../backend-clinical/MediCoreAI.Clinical/CLAUDE.md` and the controllers/DTOs there.

- `api/v1/auth` — `POST /login`, `POST /refresh`, `POST /logout`, `GET /current-user`. Access token comes
  in the response body (short-lived, ~20 min); the refresh token is an httpOnly/Secure/SameSite=Strict
  cookie the browser manages — never read or set it from JS.
- `api/v1/leads` — `GET /` (paginated + filters), `GET /{id}` (detail), `PATCH /{id}/review` (doctor's
  decision; `409` if already reviewed, `400` if `edited` without a `finalPlanId`).
- `api/v1/medical-plans` — `GET /` (active plans catalog, used by the "edit plan" selector).
- All of the above require the `Doctor` role (`[Authorize(Roles = "Doctor")]`).
- Enums serialize as **snake_case strings** over the wire (`"new"`, `"weight_control"`, `"approved"`),
  property names as **camelCase**.

Rules that follow directly from the architecture:

- **Never call `leads-clinical-ai` (Python) or the database.** All reads and writes go through the .NET API.
- **Access token in memory, not `localStorage`.** The refresh token lives only in the httpOnly cookie; send
  `credentials: "include"` on every request and retry once via `/refresh` on a 401 (Fase 4).
- The API base URL is `NEXT_PUBLIC_CLINICAL_API_URL` (`.env.local`). Dev is **https** because the refresh
  cookie is `Secure`.

## Conventions

- **Feature-sliced architecture**: business features live in `src/modules/<feature>/` (components, services,
  schemas, types per module); framework-agnostic globals in `src/shared/` (shadcn `components/ui`,
  `lib/utils`, the single `lib/api-client.ts`); `src/app/` holds thin routes only. Current modules:
  `auth` (login schema/service/context + `AuthProvider`) and `leads` (list, filters, detail, review panel,
  the `questionnaire-labels`/`plan-labels` maps). Routes: `/login`, `/dashboard` (role-guarded layout),
  `/dashboard/leads`, `/dashboard/leads/[id]`. Create a module when the business demands it, not before.
- **Desktop-first**: design and verify at desktop widths first.
- **UI copy is in Spanish** (Colombia); code identifiers, comments, and docs stay in English.
