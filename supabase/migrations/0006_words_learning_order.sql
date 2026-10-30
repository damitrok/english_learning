-- Explicit learning order for the vocabulary queue (new words are taken by
-- sort_order), plus where each word came from. The original ~90 starter words
-- keep their CEFR-then-alphabetical order at the front (1..n); the vocabulary
-- textbook units interleaved with IT terms follow from 1100 on (see
-- supabase/content/words.mjs).
alter table words
  add column sort_order integer,
  add column source text;

update words w set sort_order = o.rn, source = 'starter'
from (
  select id, row_number() over (order by cefr_level, lower(headword)) as rn from words
) o
where o.id = w.id;

alter table words alter column sort_order set not null;
create index if not exists words_sort_order_idx on words (sort_order);
