# English for IT

Personal web app for daily technical-English practice, built around Paul Nation's
"Four Strands" method. Full plan, decisions and rationale live in the project doc:
https://claude.ai/artifact/2giVckYHw8DefDkW7KQTsE

Design reference: [`docs/DESIGN.md`](docs/DESIGN.md) (dark, Raycast-style tokens — already wired into `src/app/globals.css`).

## Stack

- Next.js 16 (App Router, TypeScript), Tailwind CSS v4
- Supabase (Postgres + Auth) for storage and cross-device sync
- Magic-link sign-in (no password)

## Setup

1. Create a free project at [supabase.com](https://supabase.com).
2. Copy `.env.example` to `.env.local` and fill in the two values from
   Project Settings → API (`Project URL`, `anon public` key).
3. Apply the schema: open the Supabase SQL Editor and run
   [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql)
   (or `npx supabase db push` if you use the Supabase CLI and have linked the project).
4. In Supabase Auth settings, add `http://localhost:3000/auth/callback` (and later your
   production URL) to the allowed redirect URLs.
5. `npm install && npm run dev`, open http://localhost:3000.

## Status

Фаза 0 (foundation) from the plan is done: project skeleton, auth, DB schema, the
"Сегодня" and dashboard screens (static, not yet wired to data). Next up: Фаза 1
(vocabulary + SRS) — see the plan doc for the full roadmap and materials checklist.
