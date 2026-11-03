-- Daily tasks: besides a words lesson and a grammar-path lesson, a day now needs one finished
-- listening level. The number of finished listening games per day is kept next to the other
-- per-day counters; it does not count as a path lesson (lessons_completed stays untouched).
alter table sessions
  add column if not exists listening_games integer not null default 0;
alter table sessions drop constraint if exists sessions_listening_games_range;
alter table sessions add constraint sessions_listening_games_range check (listening_games between 0 and 1000);

-- Counts one finished listening game for the given local day. Runs as the caller, so RLS on
-- sessions applies; the date window allows every timezone around "today".
create or replace function record_listening(p_date date)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if p_date is null or p_date not between current_date - 2 and current_date + 2 then
    raise exception 'date out of range: %', p_date using errcode = '22023';
  end if;

  insert into sessions (user_id, session_date, listening_games)
  values ((select auth.uid()), p_date, 1)
  on conflict (user_id, session_date) do update set
    listening_games = least(sessions.listening_games + 1, 1000);
end;
$$;
revoke execute on function record_listening(date) from public, anon;
grant execute on function record_listening(date) to authenticated;
