-- Initial schema for the English-for-IT learning app.
-- Single user today, but every table is scoped by user_id + RLS so it survives
-- a move to multi-user without a rewrite (see docs/DESIGN plan, "Пользователи").

create extension if not exists "pgcrypto";

-- Shared vocabulary catalog (not user-scoped: the word list is the same for everyone).
create table if not exists words (
  id uuid primary key default gen_random_uuid(),
  headword text not null,
  translation text not null,
  ipa text,
  tag text not null check (tag in ('general', 'academic', 'it')),
  cefr_level text not null check (cefr_level in ('A1', 'A2', 'B1', 'B2', 'C1')),
  example_sentence text,
  created_at timestamptz not null default now()
);
create unique index if not exists words_headword_tag_idx on words (lower(headword), tag);

-- Reading texts, tagged with the words they reinforce.
create table if not exists texts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  cefr_level text not null check (cefr_level in ('A1', 'A2', 'B1', 'B2', 'C1')),
  source_url text,
  word_ids uuid[] not null default '{}',
  created_at timestamptz not null default now()
);

-- Grammar drills, grouped by topic and ordered per the grammar textbook's structure.
create table if not exists grammar_exercises (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  topic_order integer not null,
  exercise_type text not null check (exercise_type in ('multiple_choice', 'fill_blank')),
  prompt text not null,
  options text[],
  correct_answer text not null,
  created_at timestamptz not null default now()
);

-- Listening material: external links only, never hosted audio (see plan's licensing note).
create table if not exists listening_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source_url text not null,
  start_seconds integer not null default 0,
  end_seconds integer not null,
  transcript text,
  cefr_level text not null check (cefr_level in ('A1', 'A2', 'B1', 'B2', 'C1')),
  created_at timestamptz not null default now()
);

-- Per-user SRS state for a word (SM-2). One row per user+word.
create table if not exists cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  word_id uuid not null references words (id) on delete cascade,
  ease_factor real not null default 2.5,
  interval_days real not null default 0,
  repetitions integer not null default 0,
  due_at timestamptz not null default now(),
  last_result text check (last_result in ('forgot', 'hard', 'normal', 'easy')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, word_id)
);
create index if not exists cards_due_idx on cards (user_id, due_at);

-- One row per daily session, recording which of the 4 strands ran and for how long.
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  session_date date not null default current_date,
  vocab_minutes integer not null default 0,
  reading_minutes integer not null default 0,
  listening_minutes integer not null default 0,
  fluency_minutes integer not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, session_date)
);

-- Rolling aggregates for the dashboard (streak, totals) — one row per user.
create table if not exists progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  current_streak_days integer not null default 0,
  longest_streak_days integer not null default 0,
  total_words_learned integer not null default 0,
  last_session_date date,
  updated_at timestamptz not null default now()
);

-- Row Level Security: users only ever see their own cards/sessions/progress.
-- Catalog tables (words, texts, grammar_exercises, listening_items) are readable
-- by any authenticated user and written only via the service role (seeding scripts).
alter table words enable row level security;
alter table texts enable row level security;
alter table grammar_exercises enable row level security;
alter table listening_items enable row level security;
alter table cards enable row level security;
alter table sessions enable row level security;
alter table progress enable row level security;

create policy "catalog readable by authenticated users" on words
  for select to authenticated using (true);
create policy "catalog readable by authenticated users" on texts
  for select to authenticated using (true);
create policy "catalog readable by authenticated users" on grammar_exercises
  for select to authenticated using (true);
create policy "catalog readable by authenticated users" on listening_items
  for select to authenticated using (true);

create policy "users manage their own cards" on cards
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage their own sessions" on sessions
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage their own progress" on progress
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
