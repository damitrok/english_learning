-- Фаза 3: listening/shadowing + fluency.
-- listening_items now holds two kinds of material:
--   'tts'     — our own short dialogues, voiced by the browser (Web Speech API);
--               `lines` is the exact transcript, so shadowing can be checked word by word.
--   'youtube' — external videos (link + time range only, never hosted audio);
--               no transcript, listened to as extra input.
create type listening_kind as enum ('tts', 'youtube');

alter table listening_items
  add column kind listening_kind not null default 'youtube',
  add column position integer not null default 0,
  -- [{"speaker": "Anna", "text": "Good morning, everyone."}, ...] for kind = 'tts'
  add column lines jsonb not null default '[]',
  alter column source_url drop not null,
  alter column end_seconds drop not null;
alter table listening_items
  add constraint listening_items_source_check
  check (kind = 'tts' or source_url is not null);
create unique index if not exists listening_items_title_key on listening_items (title);

create table if not exists listening_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  item_id uuid not null references listening_items (id) on delete cascade,
  -- Average shadowing match, 0-100; null when speech recognition wasn't available.
  accuracy integer check (accuracy between 0 and 100),
  seconds_spent integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists listening_logs_user_idx on listening_logs (user_id, created_at);
create index if not exists listening_logs_item_idx on listening_logs (item_id);

alter table listening_logs enable row level security;
create policy "users manage their own listening logs" on listening_logs
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Fluency re-reads are logged next to normal reads, told apart by mode, so
-- "yesterday's text" can be found from the reading history.
create type read_mode as enum ('reading', 'fluency');
alter table text_reads
  add column mode read_mode not null default 'reading',
  add column words_per_minute integer;
