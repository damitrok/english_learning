-- Natural keys for the catalog seeds, so supabase/seed_phase2.sql can upsert
-- (re-running it updates content in place instead of duplicating rows or
-- deleting exercises that already have attempts attached).
create unique index if not exists grammar_exercises_topic_position_key on grammar_exercises (topic_id, position);
create unique index if not exists texts_title_key on texts (title);
