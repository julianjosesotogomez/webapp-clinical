# webapp-clinical

Doctor-facing, **desktop-first** webapp of the MediCoreAI platform. Authenticated doctors review the
leads captured by the public intake app and **validate the plan** the recommendation agent suggested
for each one — approve it, reject it, or edit it to a different plan from the catalog.

It talks to a **single backend**: the .NET `MediCoreAI.Clinical` API. It never calls the Python intake
service (`leads-clinical-ai`) or the database directly.

## What it does

- **Auth** — email/password login against `api/v1/auth`; access token kept in memory, refresh token in
  an httpOnly cookie, transparent refresh-on-401. Routes under `/dashboard` are guarded and require the
  `Doctor` role.
- **Leads list** (`/dashboard/leads`) — paginated, URL-synced status + date filters, with each lead's
  agent suggestion and review status at a glance.
- **Lead detail + decision** (`/dashboard/leads/[id]`) — readable questionnaire answers, the agent's
  suggested plan (confidence + ranked alternatives), and the review panel (approve / reject with
  mandatory notes / edit to a catalog plan). Concurrent reviews are handled (409 → clear message).

## Architecture

Feature-sliced, thin App Router routes:

```
src/
├── app/                      # thin routes only
│   ├── login/                # /login
│   └── dashboard/            # role-guarded layout
│       └── leads/            # list + [id] detail
├── modules/                  # business features (self-contained)
│   ├── auth/                 # schema · service · context (AuthProvider) · login form
│   └── leads/                # types · leads-client · components (table, filters, detail,
│                             #   agent-result-card, review-panel) · questionnaire/plan label maps
└── shared/                   # framework-agnostic
    ├── components/ui/         # shadcn primitives (Base UI) — generated, don't hand-edit
    └── lib/                   # api-client (single fetch wrapper + refresh) · utils
```

```
public intake ──▶ .NET MediCoreAI.Clinical API ──▶  webapp-clinical (this app)
(creates leads)     auth · leads · medical-plans          doctor reviews & decides
```

## Getting started

```bash
npm install
cp .env.example .env.local   # NEXT_PUBLIC_CLINICAL_API_URL → the .NET API (https://localhost:7004 in dev)
npm run dev                  # http://localhost:3000
```

Dev runs over **https** (the refresh cookie is `Secure`), and the .NET API must be running with at
least one seeded `Doctor` user. Requires **Node.js 20.9+**.

## Tech stack

Next.js 16 (App Router, React 19, React Compiler ON) · TypeScript strict · Tailwind CSS v4 (no config
file, `@theme inline`) · shadcn/ui on Base UI · react-hook-form + zod. Brand theme shared with the
mobile intake app.

Sibling of `webappmobile-clinical` (same stack). See [CLAUDE.md](./CLAUDE.md) for the full architecture
and data contract.
