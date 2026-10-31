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
**Database** GitHub Action when they land on `main` (`scripts/db-apply.sh`; applied names/hashes are
tracked in `app_migrations` / `app_seeds`). One-time setup:

1. GitHub → Settings → Secrets and variables → Actions → new secret `SUPABASE_DB_URL` (Supabase →
   Project Settings → Database → Connection string, session pooler, with the DB password).
2. Actions → **Database** → Run workflow with `baseline` ticked (the DB already has migrations
   0001–0010; this only records them). After that every merge to `main` applies what's new.

The **CI** workflow (lint, typecheck, tests, build) runs on every pull request. Run the same by hand
with `npm test`. Run `scripts/db-apply.sh` locally with `SUPABASE_DB_URL` set if you need to apply
changes without a merge.
