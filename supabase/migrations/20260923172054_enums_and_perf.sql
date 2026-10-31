-- Tighten column types from free-form checks to real enums (so generated
-- TypeScript types are precise), and apply the two perf fixes the Supabase
-- advisor flagged after 0001: an unindexed FK and RLS policies that
-- re-evaluate auth.uid() per row instead of once per query.

alter table words drop constraint if exists words_tag_check;
alter table words drop constraint if exists words_cefr_level_check;
alter table texts drop constraint if exists texts_cefr_level_check;
alter table grammar_exercises drop constraint if exists grammar_exercises_exercise_type_check;
alter table listening_items drop constraint if exists listening_items_cefr_level_check;
alter table cards drop constraint if exists cards_last_result_check;

create type word_tag as enum ('general', 'academic', 'it');
create type cefr_level as enum ('A1', 'A2', 'B1', 'B2', 'C1');
create type exercise_type as enum ('multiple_choice', 'fill_blank');
create type srs_result as enum ('forgot', 'hard', 'normal', 'easy');

alter table words
  alter column tag type word_tag using tag::word_tag,
  alter column cefr_level type cefr_level using cefr_level::cefr_level;

alter table texts
  alter column cefr_level type cefr_level using cefr_level::cefr_level;

alter table grammar_exercises
  alter column exercise_type type exercise_type using exercise_type::exercise_type;

alter table listening_items
  alter column cefr_level type cefr_level using cefr_level::cefr_level;

alter table cards
  alter column last_result type srs_result using last_result::srs_result;

-- Covering index for cards.word_id (FK) — was flagged as unindexed, and
-- doubles as the join path from words -> cards.
create index if not exists cards_word_id_idx on cards (word_id);

-- Re-create the per-user policies with auth.uid() wrapped in a subselect,
-- so Postgres evaluates it once per query instead of once per row.
drop policy if exists "users manage their own cards" on cards;
create policy "users manage their own cards" on cards
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "users manage their own sessions" on sessions;
create policy "users manage their own sessions" on sessions
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "users manage their own progress" on progress;
create policy "users manage their own progress" on progress
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
