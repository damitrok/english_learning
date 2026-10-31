#!/usr/bin/env bash
# Applies pending SQL to the Supabase database. Used by the "Database" GitHub
# Action (on push to main) and runnable by hand:
#
#   SUPABASE_DB_URL='postgresql://…' scripts/db-apply.sh            # apply what's new
#   SUPABASE_DB_URL='postgresql://…' scripts/db-apply.sh --baseline # mark current migrations as already applied
#
# - supabase/migrations/*.sql run once each, in file-name order, each in its own
#   transaction. Applied versions (the file-name prefix before the first "_") are kept in
#   supabase_migrations.schema_migrations — the same table the Supabase CLI and the Supabase
#   GitHub integration use, so all of them agree on what is applied.
# - Content seeds (seed.sql, seed_words.sql, seed_phase2.sql) are idempotent
#   upserts; they re-run only when the file's SHA-256 changed (public.app_seeds).
# The connection string is read from the environment and never printed.
set -euo pipefail

: "${SUPABASE_DB_URL:?Set SUPABASE_DB_URL (Supabase → Project Settings → Database → Connection string, session pooler)}"
cd "$(dirname "$0")/../supabase"

run() { psql "$SUPABASE_DB_URL" -X -q -v ON_ERROR_STOP=1 "$@"; }
sha() { if command -v sha256sum >/dev/null; then sha256sum "$1"; else shasum -a 256 "$1"; fi | cut -d' ' -f1; }

run -c "
create schema if not exists supabase_migrations;
create table if not exists supabase_migrations.schema_migrations (
  version text not null primary key,
  statements text[],
  name text
);
create table if not exists public.app_seeds (
  name text primary key,
  sha256 text not null,
  applied_at timestamptz not null default now()
);
alter table public.app_seeds enable row level security;"

# First run against a database that was set up by hand: the schema is already
# there but nothing is tracked yet, so record the existing migrations instead of
# re-running them.
mode="${1:-}"
if [[ -z "$mode" && "$(run -tA -c "select (select count(*) from supabase_migrations.schema_migrations) = 0 and to_regclass('public.sessions') is not null")" == "t" ]]; then
  echo "untracked database with an existing schema: baselining"
  mode="--baseline"
fi

if [[ "$mode" == "--baseline" ]]; then
  for f in migrations/*.sql; do
    name="$(basename "$f" .sql)"
    run -c "insert into supabase_migrations.schema_migrations (version, name) values ('${name%%_*}', '${name#*_}') on conflict do nothing;"
    echo "baseline: $name"
  done
  exit 0
fi

for f in migrations/*.sql; do
  name="$(basename "$f" .sql)"
  version="${name%%_*}"
  if [[ -n "$(run -tA -c "select 1 from supabase_migrations.schema_migrations where version = '$version'")" ]]; then
    echo "skip   $name"
    continue
  fi
  echo "apply  $name"
  run -1 -f "$f" -c "insert into supabase_migrations.schema_migrations (version, name) values ('$version', '${name#*_}');"
done

for f in seed.sql seed_words.sql seed_phase2.sql; do
  [[ -f "$f" ]] || continue
  hash="$(sha "$f")"
  if [[ "$(run -tA -c "select sha256 from public.app_seeds where name = '$f'")" == "$hash" ]]; then
    echo "skip   $f (unchanged)"
    continue
  fi
  echo "seed   $f"
  run -1 -f "$f" -c "insert into public.app_seeds (name, sha256) values ('$f', '$hash') on conflict (name) do update set sha256 = excluded.sha256, applied_at = now();"
done
