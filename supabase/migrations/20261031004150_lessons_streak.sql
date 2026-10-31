-- Duolingo-style progress: every finished lesson counts. A day counts toward the
-- streak once it has 3 finished lessons (no upper limit), and the position on the
-- lesson path is the lifetime total of finished lessons.
-- Removed features are dropped with their data: listening/shadowing (tables,
-- enum, minutes column), fluency re-reads (text_reads.mode / words_per_minute),
-- the never-used `progress` table and the per-day `completed_steps` list.
alter table sessions
  add column lessons_completed integer not null default 0;

-- Before this migration a step was recorded once per day, so the number of
-- distinct steps is the best available count of lessons finished that day.
update sessions set lessons_completed = cardinality(completed_steps);

-- Minutes per strand: fluency_minutes becomes practice_minutes (build + translate).
alter table sessions rename column fluency_minutes to practice_minutes;

-- Lesson types: vocab, context, grammar, build, reading, translate, review.
-- Minutes go to the strand a type belongs to: vocab+context, grammar+review,
-- reading, practice (build+translate).
create or replace function record_step(p_date date, p_step text, p_minutes integer)
returns void
language sql
security invoker
set search_path = public
as $$
  insert into sessions (user_id, session_date, lessons_completed,
    vocab_minutes, grammar_minutes, reading_minutes, practice_minutes)
  values (
    (select auth.uid()), p_date, 1,
    case when p_step in ('vocab', 'context') then p_minutes else 0 end,
    case when p_step in ('grammar', 'review') then p_minutes else 0 end,
    case when p_step = 'reading' then p_minutes else 0 end,
    case when p_step in ('build', 'translate') then p_minutes else 0 end
  )
  on conflict (user_id, session_date) do update set
    lessons_completed = sessions.lessons_completed + 1,
    vocab_minutes = sessions.vocab_minutes + excluded.vocab_minutes,
    grammar_minutes = sessions.grammar_minutes + excluded.grammar_minutes,
    reading_minutes = sessions.reading_minutes + excluded.reading_minutes,
    practice_minutes = sessions.practice_minutes + excluded.practice_minutes;
$$;

-- Cleanup of removed features (destructive).
alter table sessions drop constraint sessions_completed_steps_check;
alter table sessions drop column completed_steps;
alter table sessions drop column listening_minutes;

drop table if exists listening_logs;
drop table if exists listening_items;
drop type if exists listening_kind;
drop table if exists progress;

delete from text_reads where mode = 'fluency';
alter table text_reads drop column mode;
alter table text_reads drop column words_per_minute;
drop type if exists read_mode;
