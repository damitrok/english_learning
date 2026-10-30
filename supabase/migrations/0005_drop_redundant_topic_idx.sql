-- The unique (topic_id, position) index from 0004 also serves topic lookups, so
-- 0003's plain index on the same columns is redundant.
drop index if exists grammar_exercises_topic_idx;
