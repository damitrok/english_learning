# English for IT

Personal web app for daily technical-English practice, built around Paul Nation's
"Four Strands" method. Full plan, decisions and rationale live in the project doc:
https://claude.ai/artifact/2giVckYHw8DefDkW7KQTsE

Design reference: [`docs/DESIGN.md`](docs/DESIGN.md) (dark, Raycast-style tokens — already wired into `src/app/globals.css`).

## Stack

- Next.js 16 (App Router, TypeScript), Tailwind CSS v4
- Supabase (Postgres + Auth) for storage and cross-device sync — project ref `betitjcrobqmuumlsjrv`
- Magic-link sign-in (no password)

## Live

- **Production**: https://englishlearning-liart.vercel.app
- **Repo**: https://github.com/damitrok/english_learning
- Vercel project `mitrofan12a-2162/english_learning` is linked (`.vercel/` locally) but **not yet on
  auto-deploy from GitHub** — the Vercel GitHub App needs a one-time authorization for the
  `damitrok` account (Vercel dashboard → this project → Settings → Git → Connect). Until then,
  ship changes with `vercel --prod` from this directory.

## Local setup

1. `.env.local` already has the real Supabase URL + publishable key for this project — no
   placeholder values needed. `.env.example` documents the two variables if you ever repoint
   this to a different Supabase project.
2. Schema + seed are already applied to the live project (`supabase/migrations/`, `supabase/seed.sql`)
   via the Supabase MCP connector. Re-run them (SQL Editor, or MCP `apply_migration`/`execute_sql`)
   only if you reset the database.
3. `npm install && npm run dev`, open http://localhost:3000.
4. **Magic-link testing gotcha**: the sign-in flow uses PKCE, so the confirmation link only works in
   the *same browser* that requested it. Request the link and open the email in one regular browser
   window, not across two different browsers or automation tools.

## Auth redirect URLs

Supabase Auth's allowed redirect URLs must include, for every place this app is reachable from:
- `http://localhost:3000/auth/callback` (local dev)
- `https://englishlearning-liart.vercel.app/auth/callback` (production)

Set these in the Supabase Dashboard → Authentication → URL Configuration (not available via MCP).

## Status

Фазы 0-2 from the plan are done: auth, DB schema, the "Сегодня"/dashboard screens, a ~90-word
seeded vocabulary with an SM-2 review screen (`/session/vocab`), a reading screen with 12 A1-A2
texts (`/session/reading`) and grammar lessons following the grammar textbook's unit order
(`/session/grammar`, exercises for units 1-12 so far). Next up: Фаза 3 (listening/shadowing +
fluency) — see the plan doc for the full roadmap.

## Content

Grammar exercises and reading texts are written by hand in `supabase/content/*.mjs` (own wording —
only unit titles/order come from the textbook). After editing, regenerate and apply the seed:

```bash
node supabase/content/build-seed.mjs   # validates content, writes supabase/seed_phase2.sql
```

then run `supabase/seed_phase2.sql` in the SQL Editor (or via the Supabase MCP). It upserts, so
re-running it is safe and keeps existing attempts/reads.
