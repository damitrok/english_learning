-- Words moved out of the lesson path into their own tab. A words session still counts as a
-- lesson for the daily streak (lessons_completed), but must not advance the path, so
-- word_sessions counts them separately: path position = sum(lessons_completed - word_sessions).
alter table sessions
  add column word_sessions integer not null default 0;

create or replace function record_step(p_date date, p_step text, p_minutes integer)
returns void
language sql
security invoker
set search_path = public
as $$
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
$$;
