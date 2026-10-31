-- Default so plain inserts (e.g. supabase/seed.sql after a db reset) still work;
-- 0-order words sort first, tie-broken by CEFR level and headword in the app.
alter table words alter column sort_order set default 0;
