# English for IT

Personal web app for daily technical-English practice, built around Paul Nation's
"Four Strands" method. Full plan, decisions and rationale live in the project doc:
https://claude.ai/artifact/2giVckYHw8DefDkW7KQTsE

Design reference: [`docs/DESIGN.md`](docs/DESIGN.md) (dark, Raycast-style tokens — already wired into `src/app/globals.css`).

## Stack

- Next.js 16 (App Router, TypeScript), Tailwind CSS v4
- Supabase (Postgres + Auth) for storage and cross-device sync — project ref `betitjcrobqmuumlsjrv`
- Email + password sign-in; registration and password reset confirmed with a one-time code sent by email (no links)

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

## Auth

Sign-in, sign-up and password reset all run in server actions (`src/lib/auth.ts`), so the session
cookies come from `Set-Cookie` headers and are refreshed only by the proxy (`src/proxy.ts`) — there is
no auth client in the browser. Flows: register (email + password → emailed 6-digit code → in), sign in
(email + password), reset or first-time password for an old passwordless account («Забыл пароль» →
code → new password).

Supabase's built-in mailer only delivers to project team members, so production uses a custom SMTP
(Brevo): Dashboard → Authentication → Emails → SMTP Settings. Email templates (code only, no links)
live in `supabase/templates/`: paste `confirm-signup.html` into **Confirm signup** (subject
«Подтверди email — English for IT») and `recovery.html` into **Reset password** (subject «Сброс пароля —
English for IT»).

Dashboard settings to check (Authentication):
- Providers → Email: **Confirm email** on; minimum password length 8.
- Sessions: **Refresh token reuse interval** 60 s (default 10 s); no inactivity timeout / time-box.
- Project Settings → Auth (JWT): **JWT expiry** 604800 (7 days). The app refreshes the session only
  when the access token expires; a long expiry means far fewer refreshes, and every lost refresh
  response on a flaky mobile connection is what used to log people out.

## Status

The MVP is done. Learning is a Duolingo-style lesson path on the home screen: every node is a
lesson (vocabulary SM-2, words in context, grammar, build-a-sentence, reading, RU→EN translation, mistakes review — repeating), finishing 3 lessons in a local day
counts the day toward the streak, and there is no daily cap. The speaking/listening section was
removed. Plus a progress dashboard and PWA install + offline support. Install on a phone via "Add to
Home Screen" (Safari) or the install prompt (Chrome).
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

## Tests

```bash
npm test             # one-off run (Vitest, node environment, ~1 s)
npm run test:watch   # re-run on change while developing
```

Unit tests live next to the code as `src/lib/*.test.ts` and cover the pure logic: local-day math and
streaks (`dates.ts`), the lesson path (`path.ts`), SM-2 spaced repetition (`srs.ts`), headword
highlighting (`highlight.ts`) and Russian plurals (`plural.ts`). Supabase, server actions and UI are
not covered. Run `npm test` before every deploy (and in CI, if added) along with `npm run lint` and
`npm run build`.

## Database deploys (via git)

New `supabase/migrations/*.sql` files and changed seeds (`seed*.sql`) are applied to Supabase by the
**Database** GitHub Action when they land on `main` (`scripts/db-apply.sh`; applied versions are
tracked in Supabase's own `supabase_migrations.schema_migrations`, seed hashes in `app_seeds`). One-time setup:

1. GitHub → Settings → Secrets and variables → Actions → new secret `SUPABASE_DB_URL` (Supabase →
   Project Settings → Database → Connection string, session pooler, with the DB password).
2. Nothing else: the first run on `main` sees an existing schema with no tracking and just records
   the existing migrations as applied (the `Database` workflow can also be run by hand once it is on
   `main`; its `baseline` option does the same explicitly). After that every merge to `main` applies
   what's new.

The **CI** workflow (lint, typecheck, tests, build) runs on every pull request. Run the same by hand
with `npm test`. Run `scripts/db-apply.sh` locally with `SUPABASE_DB_URL` set if you need to apply
changes without a merge.
