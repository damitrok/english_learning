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

## Auth email

Supabase's built-in mailer only delivers to project team members, so production uses a custom
SMTP (Brevo) set in Dashboard → Authentication → Emails → SMTP Settings. The email template lives
in `supabase/templates/magic-link.html` — paste it into both the "Magic Link" and "Confirm signup"
templates (subject «Вход в English for IT»). It carries the link and the one-time code
(`{{ .Token }}`), which the login screen accepts too — needed inside the installed iOS app, where
the link opens in Safari and can't finish the PKCE flow.

## Auth redirect URLs

Supabase Auth's allowed redirect URLs must include, for every place this app is reachable from:
- `http://localhost:3000/auth/callback` (local dev)
- `https://englishlearning-liart.vercel.app/auth/callback` (production)

Set these in the Supabase Dashboard → Authentication → URL Configuration (not available via MCP).

## Status

The MVP (Фазы 0-4 of the plan) is done: all four daily steps on «Сегодня» with done marks and
«Дальше →» between them — SM-2 vocabulary (825 words) plus grammar lessons, reading, listening/
shadowing, fluency — streaks per local day (weekends without a session don't break them), a
progress dashboard, and PWA install + offline support. Install on a phone via "Add to Home Screen"
(Safari) or the install prompt (Chrome). Speech recognition for shadowing needs Chrome/Edge/Safari.
Optional Фаза 5 ideas are in the plan doc.

## Content

Grammar exercises and reading texts are written by hand in `supabase/content/*.mjs` (own wording —
only unit titles/order come from the textbook). After editing, regenerate and apply the seed:

```bash
node supabase/content/build-seed.mjs   # validates content, writes supabase/seed_phase2.sql
```

then run `supabase/seed_phase2.sql` in the SQL Editor (or via the Supabase MCP). It upserts, so
re-running it is safe and keeps existing attempts/reads.

Vocabulary works the same way: `supabase/content/words.mjs` holds the 30 units of the vocabulary
textbook (own translations/examples) with 5 IT terms after each unit; `node
supabase/content/build-words.mjs` checks that every book word is covered and writes
`supabase/seed_words.sql`. New words enter the SRS queue in `words.sort_order`.
