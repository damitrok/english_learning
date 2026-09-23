-- Фаза 2: reading + grammar.
-- Grammar topics become their own catalog table (one row per unit of the grammar
-- textbook, in textbook order) so exercises can reference a topic by id and the
-- app can walk the topics in order. Per-user history for both steps lives in
-- grammar_attempts / text_reads, scoped by RLS like cards/sessions.

create table if not exists grammar_topics (
  id uuid primary key default gen_random_uuid(),
  unit integer not null unique,
  section text not null,
  title text not null,
  -- Short rule summary in Russian, written in our own words (not copied from the book).
  summary text,
  created_at timestamptz not null default now()
);

-- grammar_exercises was never populated, so reshape it freely: topic text/order
-- are replaced by a FK to grammar_topics.
alter table grammar_exercises drop column if exists topic;
alter table grammar_exercises drop column if exists topic_order;
alter table grammar_exercises
  add column topic_id uuid not null references grammar_topics (id) on delete cascade,
  add column position integer not null default 0,
  -- Extra answers accepted for fill_blank besides correct_answer (e.g. "is not" for "isn't").
  add column accepted_answers text[] not null default '{}',
  -- Why the answer is right, shown after the user answers.
  add column explanation text;
create index if not exists grammar_exercises_topic_idx on grammar_exercises (topic_id, position);

-- Reading order within the catalog, plus simple true/false comprehension checks:
-- [{"statement": "...", "answer": true}, ...]
alter table texts
  add column position integer not null default 0,
  add column questions jsonb not null default '[]';
create index if not exists texts_position_idx on texts (cefr_level, position);

create table if not exists grammar_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  exercise_id uuid not null references grammar_exercises (id) on delete cascade,
  answer text not null,
  is_correct boolean not null,
  created_at timestamptz not null default now()
);
create index if not exists grammar_attempts_user_idx on grammar_attempts (user_id, created_at);
create index if not exists grammar_attempts_exercise_idx on grammar_attempts (exercise_id);

create table if not exists text_reads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  text_id uuid not null references texts (id) on delete cascade,
  seconds_spent integer not null default 0,
  correct_answers integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists text_reads_user_idx on text_reads (user_id, created_at);
create index if not exists text_reads_text_idx on text_reads (text_id);

alter table grammar_topics enable row level security;
alter table grammar_attempts enable row level security;
alter table text_reads enable row level security;

create policy "catalog readable by authenticated users" on grammar_topics
  for select to authenticated using (true);

create policy "users manage their own grammar attempts" on grammar_attempts
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "users manage their own text reads" on text_reads
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
