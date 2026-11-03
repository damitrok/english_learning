-- 1) Feedback from users: they can only add messages; the owner reads them in the dashboard.
--    The messages go away together with the account.
-- 2) delete_own_account(): lets a signed-in user delete their own account. Removing the row in
--    auth.users cascades to every table that references it, so the app never needs a service key.
-- Written to be re-runnable (the same SQL may be applied by hand and then by the Database workflow).

create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  message text not null check (length(btrim(message)) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index if not exists feedback_user_created_idx on feedback (user_id, created_at desc);
alter table feedback enable row level security;

drop policy if exists "feedback: insert own" on feedback;
create policy "feedback: insert own" on feedback
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

revoke all on feedback from anon, authenticated;
grant insert on feedback to authenticated;

-- At most 5 messages per hour per user. SECURITY DEFINER because the caller has no read access.
create or replace function feedback_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select count(*) from public.feedback
      where user_id = new.user_id and created_at > now() - interval '1 hour') >= 5 then
    raise exception 'feedback_rate_limit';
  end if;
  return new;
end;
$$;
revoke execute on function feedback_rate_limit() from public, anon, authenticated;

drop trigger if exists feedback_rate_limit on feedback;
create trigger feedback_rate_limit
  before insert on feedback
  for each row execute function feedback_rate_limit();

create or replace function delete_own_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'not signed in' using errcode = '28000';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;
revoke execute on function delete_own_account() from public, anon;
grant execute on function delete_own_account() to authenticated;
