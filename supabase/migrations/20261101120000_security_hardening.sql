-- Security hardening (audit of 2026-11-01).
-- 1) Throttle for the sign-in endpoints: Supabase Auth only sees the hosting server's IP, so the
--    app counts attempts per client IP and per email itself.
-- 2) record_step rejects unknown steps and absurd minutes instead of trusting the caller.
-- 3) CHECK constraints so even a direct PostgREST write can't store garbage.
-- 4) Privileges: the anon role never needs the app tables; signed-in users can't write the catalogs.
--    RLS already blocks all of this — the revokes are a second lock.

-- 1) Attempt counter (fixed window per key). Keys are hashes, never raw emails or IPs.
create table if not exists auth_throttle (
  key text primary key check (length(key) between 1 and 128),
  window_start timestamptz not null default now(),
  hits integer not null default 0
);
alter table auth_throttle enable row level security;

-- Counts one attempt for `p_key`; returns false once more than `p_limit` attempts fall into the
-- current `p_window_seconds` window. SECURITY DEFINER because the table is closed to API roles.
create or replace function auth_throttle_hit(p_key text, p_limit integer, p_window_seconds integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_hits integer;
begin
  if p_key is null or length(p_key) not between 1 and 128
     or p_limit is null or p_limit not between 1 and 1000
     or p_window_seconds is null or p_window_seconds not between 1 and 86400 then
    raise exception 'bad throttle arguments' using errcode = '22023';
  end if;

  insert into auth_throttle as t (key, window_start, hits)
  values (p_key, now(), 1)
  on conflict (key) do update set
    window_start = case when t.window_start < now() - make_interval(secs => p_window_seconds)
                        then now() else t.window_start end,
    hits = case when t.window_start < now() - make_interval(secs => p_window_seconds)
                then 1 else t.hits + 1 end
  returning hits into v_hits;

  -- Housekeeping: now and then drop windows that ended long ago.
  if random() < 0.02 then
    delete from auth_throttle where window_start < now() - interval '1 day';
  end if;

  return v_hits <= p_limit;
end;
$$;
revoke execute on function auth_throttle_hit(text, integer, integer) from public;
grant execute on function auth_throttle_hit(text, integer, integer) to anon, authenticated;

-- 2) record_step with input checks (still runs as the caller, so RLS on sessions applies).
create or replace function record_step(p_date date, p_step text, p_minutes integer)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if p_step is null or p_step not in ('vocab', 'grammar', 'build', 'reading', 'translate', 'review') then
    raise exception 'unknown step %', p_step using errcode = '22023';
  end if;
  if p_minutes is null or p_minutes < 0 or p_minutes > 240 then
    raise exception 'minutes out of range: %', p_minutes using errcode = '22023';
  end if;

  insert into sessions (user_id, session_date, lessons_completed, word_sessions,
    vocab_minutes, grammar_minutes, reading_minutes, practice_minutes)
  values (
    (select auth.uid()), p_date, 1,
    case when p_step = 'vocab' then 1 else 0 end,
    case when p_step = 'vocab' then p_minutes else 0 end,
    case when p_step in ('grammar', 'review') then p_minutes else 0 end,
    case when p_step = 'reading' then p_minutes else 0 end,
    case when p_step in ('build', 'translate') then p_minutes else 0 end
  )
  on conflict (user_id, session_date) do update set
    lessons_completed = sessions.lessons_completed + 1,
    word_sessions = sessions.word_sessions + excluded.word_sessions,
    vocab_minutes = sessions.vocab_minutes + excluded.vocab_minutes,
    grammar_minutes = sessions.grammar_minutes + excluded.grammar_minutes,
    reading_minutes = sessions.reading_minutes + excluded.reading_minutes,
    practice_minutes = sessions.practice_minutes + excluded.practice_minutes;
end;
$$;

-- 3) Sanity limits on user-written rows.
alter table grammar_attempts add constraint grammar_attempts_answer_len check (length(answer) <= 500);
alter table text_reads
  add constraint text_reads_seconds_range check (seconds_spent between 0 and 86400),
  add constraint text_reads_correct_range check (correct_answers between 0 and 100);

-- 4) Privileges.
revoke all on all tables in schema public from anon;
alter default privileges in schema public revoke all on tables from anon;
revoke all on app_seeds, auth_throttle from authenticated;
revoke insert, update, delete, truncate, references, trigger
  on words, texts, grammar_exercises, grammar_topics from authenticated;
revoke truncate, references, trigger on cards, sessions, grammar_attempts, text_reads from authenticated;
