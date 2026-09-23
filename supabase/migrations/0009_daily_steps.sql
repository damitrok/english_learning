-- Фаза 4: which steps of the daily session are done, per local day.
-- One `sessions` row per user and local date (the client's timezone decides
-- what "today" is). completed_steps lists finished steps: vocab, grammar,
-- reading, listening, fluency. A day counts toward the streak once the four
-- core steps (everything except the optional grammar block) are in it.
alter table sessions
  add column grammar_minutes integer not null default 0,
  add column completed_steps text[] not null default '{}';

alter table sessions
  add constraint sessions_completed_steps_check
  check (completed_steps <@ array['vocab', 'grammar', 'reading', 'listening', 'fluency']);

-- Marks a step done for the given local date and adds the time spent to that
-- strand's minutes. Runs as the caller, so RLS on sessions still applies.
create or replace function record_step(p_date date, p_step text, p_minutes integer)
returns void
language sql
security invoker
set search_path = public
as $$
  insert into sessions (user_id, session_date, completed_steps,
    vocab_minutes, grammar_minutes, reading_minutes, listening_minutes, fluency_minutes)
  values (
    (select auth.uid()), p_date, array[p_step],
    case when p_step = 'vocab' then p_minutes else 0 end,
    case when p_step = 'grammar' then p_minutes else 0 end,
    case when p_step = 'reading' then p_minutes else 0 end,
    case when p_step = 'listening' then p_minutes else 0 end,
    case when p_step = 'fluency' then p_minutes else 0 end
  )
  on conflict (user_id, session_date) do update set
    completed_steps = case
      when p_step = any(sessions.completed_steps) then sessions.completed_steps
      else sessions.completed_steps || p_step
    end,
    vocab_minutes = sessions.vocab_minutes + excluded.vocab_minutes,
    grammar_minutes = sessions.grammar_minutes + excluded.grammar_minutes,
    reading_minutes = sessions.reading_minutes + excluded.reading_minutes,
    listening_minutes = sessions.listening_minutes + excluded.listening_minutes,
    fluency_minutes = sessions.fluency_minutes + excluded.fluency_minutes;
$$;

revoke execute on function record_step(date, text, integer) from public, anon;
grant execute on function record_step(date, text, integer) to authenticated;
