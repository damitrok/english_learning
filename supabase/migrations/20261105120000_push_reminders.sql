-- Push reminders: one row per device (browser/PWA install) that agreed to get them.
-- The table is closed to the API roles; people manage their own devices through the two functions
-- below, and the reminder job reads everything with the service role.
create table if not exists push_subscriptions (
  endpoint text primary key check (length(endpoint) between 1 and 2048),
  user_id uuid not null references auth.users (id) on delete cascade,
  p256dh text not null check (length(p256dh) between 1 and 256),
  auth text not null check (length(auth) between 1 and 256),
  -- IANA time zone of the device: the reminder goes out in the evening of the person's own day.
  time_zone text not null default 'UTC' check (length(time_zone) between 1 and 64),
  -- Local date of the last reminder, so there is at most one a day.
  last_sent_on date,
  created_at timestamptz not null default now()
);
create index if not exists push_subscriptions_user_idx on push_subscriptions (user_id);
alter table push_subscriptions enable row level security;
revoke all on push_subscriptions from anon, authenticated;

-- Adds or refreshes this device for the signed-in user. A device that was used by someone else
-- before is handed over (and its reminder history reset). At most 10 devices per user are kept.
create or replace function save_push_subscription(p_endpoint text, p_p256dh text, p_auth text, p_time_zone text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
begin
  if v_user is null then
    raise exception 'not signed in' using errcode = '28000';
  end if;

  insert into public.push_subscriptions as s (endpoint, user_id, p256dh, auth, time_zone)
  values (p_endpoint, v_user, p_p256dh, p_auth, coalesce(nullif(p_time_zone, ''), 'UTC'))
  on conflict (endpoint) do update set
    last_sent_on = case when s.user_id = excluded.user_id then s.last_sent_on else null end,
    user_id = excluded.user_id,
    p256dh = excluded.p256dh,
    auth = excluded.auth,
    time_zone = excluded.time_zone;

  delete from public.push_subscriptions
  where user_id = v_user
    and endpoint not in (
      select endpoint from public.push_subscriptions
      where user_id = v_user order by created_at desc limit 10
    );
end;
$$;
revoke execute on function save_push_subscription(text, text, text, text) from public, anon;
grant execute on function save_push_subscription(text, text, text, text) to authenticated;

-- Forgets this device (only if it belongs to the signed-in user).
create or replace function remove_push_subscription(p_endpoint text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'not signed in' using errcode = '28000';
  end if;
  delete from public.push_subscriptions where endpoint = p_endpoint and user_id = auth.uid();
end;
$$;
revoke execute on function remove_push_subscription(text) from public, anon;
grant execute on function remove_push_subscription(text) to authenticated;
