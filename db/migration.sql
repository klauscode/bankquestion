create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  display_name text,
  plan text not null default 'free' check (plan in ('free', 'pro', 'lifetime')),
  plan_expires_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  source_ref text not null unique,
  text text not null,
  image_url text,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  option_e text not null,
  correct_answer text not null check (correct_answer in ('A', 'B', 'C', 'D', 'E')),
  explanation text,
  subject text,
  exam_origin text not null check (exam_origin in ('ENEM', 'FUVEST', 'UNICAMP', 'VUNESP')),
  difficulty text check (difficulty in ('easy', 'medium', 'hard')),
  year integer,
  tags text[],
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.practice_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  filters jsonb not null default '{}'::jsonb,
  question_count integer not null check (question_count > 0),
  allow_reanswer boolean not null default false,
  started_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz
);

create table if not exists public.practice_session_items (
  session_id uuid not null references public.practice_sessions (id) on delete cascade,
  question_id uuid not null references public.questions (id) on delete cascade,
  position integer not null check (position > 0),
  primary key (session_id, position),
  unique (session_id, question_id)
);

create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  question_id uuid not null references public.questions (id) on delete cascade,
  session_id uuid references public.practice_sessions (id) on delete set null,
  selected_answer text not null check (selected_answer in ('A', 'B', 'C', 'D', 'E')),
  is_correct boolean not null,
  answered_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  question_id uuid not null references public.questions (id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  unique (user_id, question_id)
);

create index if not exists attempts_user_id_idx on public.attempts (user_id);
create index if not exists attempts_question_id_idx on public.attempts (question_id);
create index if not exists attempts_user_answered_at_idx on public.attempts (user_id, answered_at desc);
create index if not exists attempts_user_correct_idx on public.attempts (user_id, is_correct);
create unique index if not exists attempts_session_question_unique_idx on public.attempts (session_id, question_id) where session_id is not null;
create index if not exists questions_exam_origin_idx on public.questions (exam_origin);
create index if not exists questions_subject_idx on public.questions (subject);
create index if not exists questions_exam_subject_idx on public.questions (exam_origin, subject);
create index if not exists questions_year_idx on public.questions (year);
create index if not exists practice_sessions_user_started_idx on public.practice_sessions (user_id, started_at desc);
create index if not exists practice_session_items_session_position_idx on public.practice_session_items (session_id, position);

create or replace function public.set_current_timestamp_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do update
  set email = excluded.email,
      display_name = coalesce(excluded.display_name, public.profiles.display_name);

  return new;
end;
$$;

drop trigger if exists on_profiles_updated on public.profiles;
create trigger on_profiles_updated
before update on public.profiles
for each row
execute function public.set_current_timestamp_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.attempts enable row level security;
alter table public.bookmarks enable row level security;
alter table public.practice_sessions enable row level security;
alter table public.practice_session_items enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "attempts_select_own" on public.attempts;
create policy "attempts_select_own"
on public.attempts
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "attempts_insert_own" on public.attempts;
create policy "attempts_insert_own"
on public.attempts
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "bookmarks_select_own" on public.bookmarks;
create policy "bookmarks_select_own"
on public.bookmarks
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "bookmarks_insert_own" on public.bookmarks;
create policy "bookmarks_insert_own"
on public.bookmarks
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "bookmarks_delete_own" on public.bookmarks;
create policy "bookmarks_delete_own"
on public.bookmarks
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "practice_sessions_select_own" on public.practice_sessions;
create policy "practice_sessions_select_own"
on public.practice_sessions
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "practice_sessions_insert_own" on public.practice_sessions;
create policy "practice_sessions_insert_own"
on public.practice_sessions
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "practice_sessions_update_own" on public.practice_sessions;
create policy "practice_sessions_update_own"
on public.practice_sessions
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "practice_session_items_select_own" on public.practice_session_items;
create policy "practice_session_items_select_own"
on public.practice_session_items
for select
to authenticated
using (
  exists (
    select 1
    from public.practice_sessions sessions
    where sessions.id = practice_session_items.session_id
      and sessions.user_id = auth.uid()
  )
);

drop policy if exists "practice_session_items_insert_own" on public.practice_session_items;
create policy "practice_session_items_insert_own"
on public.practice_session_items
for insert
to authenticated
with check (
  exists (
    select 1
    from public.practice_sessions sessions
    where sessions.id = practice_session_items.session_id
      and sessions.user_id = auth.uid()
  )
);

create or replace view public.daily_user_stats
with (security_invoker = true)
as
select
  a.user_id,
  date_trunc('day', a.answered_at) as answered_day,
  count(*) as total_answered,
  count(*) filter (where a.is_correct) as total_correct,
  case
    when count(*) = 0 then 0
    else round((count(*) filter (where a.is_correct)::numeric / count(*)::numeric) * 100, 2)
  end as accuracy
from public.attempts a
group by 1, 2;

comment on view public.daily_user_stats is
'Promote this view to a materialized view once dashboard reads become expensive, typically after sustained growth above roughly 1,000 active users or when accuracy queries begin to dominate page latency.';
