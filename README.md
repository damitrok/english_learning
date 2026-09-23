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

Фаза 0 and Фаза 1 from the plan are done: project skeleton, auth, DB schema (now with proper
Postgres enums), the "Сегодня"/dashboard screens, a ~90-word seeded vocabulary, and a working
SM-2 review screen at `/session/vocab` with Web Speech TTS. Deployed to Vercel. Next up: Фаза 2
(reading texts + grammar) — see the plan doc for the full roadmap and materials checklist.
