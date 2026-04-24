create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  timezone text not null default 'Asia/Kolkata',
  created_at timestamptz not null default now()
);

create table public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 80),
  icon text not null default 'circle',
  color text not null default 'moss',
  cadence text not null default 'daily',
  sort_order integer not null default 0,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.habit_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  habit_id uuid not null references public.habits(id) on delete cascade,
  completed_date date not null,
  completed_at timestamptz not null default now(),
  xp_awarded integer not null default 10,
  unique (user_id, habit_id, completed_date)
);

create table public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workout_date date not null,
  type text not null check (char_length(type) between 1 and 40),
  duration_minutes integer check (duration_minutes is null or duration_minutes > 0),
  notes text,
  xp_awarded integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.exercise_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workout_id uuid not null references public.workouts(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  sets integer not null check (sets > 0),
  reps integer not null check (reps > 0),
  weight numeric,
  unit text,
  sort_order integer not null default 0
);

create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null,
  content text not null check (char_length(content) > 0),
  mood text,
  tags text[] not null default '{}',
  xp_awarded integer not null default 15,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, entry_date)
);

create table public.daily_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  score_date date not null,
  xp integer not null default 0,
  completion_percent integer not null default 0,
  completed_habits integer not null default 0,
  total_habits integer not null default 0,
  has_workout boolean not null default false,
  has_journal boolean not null default false,
  streak_count integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (user_id, score_date)
);

create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  key text not null,
  title text not null,
  description text not null,
  icon text not null default 'award',
  unlocked_at timestamptz not null default now(),
  unique (user_id, key)
);

create index habits_user_active_idx on public.habits(user_id, is_archived, sort_order);
create index habit_completions_user_date_idx on public.habit_completions(user_id, completed_date);
create index workouts_user_date_idx on public.workouts(user_id, workout_date);
create index exercise_entries_workout_idx on public.exercise_entries(workout_id, sort_order);
create index journal_entries_user_date_idx on public.journal_entries(user_id, entry_date);
create index daily_scores_user_date_idx on public.daily_scores(user_id, score_date);
create index achievements_user_unlocked_idx on public.achievements(user_id, unlocked_at desc);

alter table public.profiles enable row level security;
alter table public.habits enable row level security;
alter table public.habit_completions enable row level security;
alter table public.workouts enable row level security;
alter table public.exercise_entries enable row level security;
alter table public.journal_entries enable row level security;
alter table public.daily_scores enable row level security;
alter table public.achievements enable row level security;

create policy "Profiles are owned by users"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id);

create policy "Users update own profile"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "Users read own habits"
on public.habits for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users create own habits"
on public.habits for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users update own habits"
on public.habits for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users read own habit completions"
on public.habit_completions for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users read own workouts"
on public.workouts for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users read own exercises"
on public.exercise_entries for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users read own journal"
on public.journal_entries for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users read own daily scores"
on public.daily_scores for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users read own achievements"
on public.achievements for select
to authenticated
using ((select auth.uid()) = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.calculate_show_up_streak(p_user_id uuid, p_date date)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  streak integer := 0;
  day_cursor date := p_date;
  day_percent integer;
begin
  loop
    select completion_percent into day_percent
    from public.daily_scores
    where user_id = p_user_id and score_date = day_cursor;

    exit when coalesce(day_percent, 0) <= 0;
    streak := streak + 1;
    day_cursor := day_cursor - 1;
  end loop;

  return streak;
end;
$$;

create or replace function public.unlock_achievement(
  p_user_id uuid,
  p_key text,
  p_title text,
  p_description text,
  p_icon text default 'award'
)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.achievements (user_id, key, title, description, icon)
  values (p_user_id, p_key, p_title, p_description, p_icon)
  on conflict (user_id, key) do nothing;
$$;

create or replace function public.unlock_achievements_for_day(p_user_id uuid, p_date date)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  score_row public.daily_scores%rowtype;
begin
  select * into score_row
  from public.daily_scores
  where user_id = p_user_id and score_date = p_date;

  if exists (select 1 from public.habit_completions where user_id = p_user_id) then
    perform public.unlock_achievement(p_user_id, 'first_habit', 'First habit', 'You checked in with yourself.', 'check');
  end if;

  if exists (select 1 from public.workouts where user_id = p_user_id) then
    perform public.unlock_achievement(p_user_id, 'first_workout', 'First workout', 'Training has entered the rhythm.', 'dumbbell');
  end if;

  if exists (select 1 from public.journal_entries where user_id = p_user_id) then
    perform public.unlock_achievement(p_user_id, 'first_journal', 'First reflection', 'A thought became part of the day.', 'journal');
  end if;

  if score_row.completion_percent = 100 and score_row.total_habits > 0 then
    perform public.unlock_achievement(p_user_id, 'perfect_day', 'Perfect day', 'Every key action landed.', 'sparkles');
  end if;

  if score_row.streak_count >= 3 then
    perform public.unlock_achievement(p_user_id, 'three_day_streak', 'Three-day streak', 'Consistency is starting to compound.', 'flame');
  end if;

  if score_row.streak_count >= 7 then
    perform public.unlock_achievement(p_user_id, 'seven_day_streak', 'Seven-day streak', 'A full week of showing up.', 'award');
  end if;
end;
$$;

create or replace function public.sync_daily_score(p_user_id uuid, p_date date)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_total_habits integer;
  v_completed_habits integer;
  v_has_workout boolean;
  v_has_journal boolean;
  v_xp integer;
  v_denominator integer;
  v_completion integer;
  v_streak integer;
  v_score public.daily_scores%rowtype;
begin
  select count(*) into v_total_habits
  from public.habits
  where user_id = p_user_id and is_archived = false;

  select count(*) into v_completed_habits
  from public.habit_completions
  where user_id = p_user_id and completed_date = p_date;

  select exists (
    select 1 from public.workouts where user_id = p_user_id and workout_date = p_date
  ) into v_has_workout;

  select exists (
    select 1 from public.journal_entries where user_id = p_user_id and entry_date = p_date and char_length(content) > 0
  ) into v_has_journal;

  select
    coalesce((select sum(xp_awarded) from public.habit_completions where user_id = p_user_id and completed_date = p_date), 0)
    + coalesce((select sum(xp_awarded) from public.workouts where user_id = p_user_id and workout_date = p_date), 0)
    + coalesce((select sum(xp_awarded) from public.journal_entries where user_id = p_user_id and entry_date = p_date), 0)
  into v_xp;

  v_denominator := v_total_habits + 2;
  v_completion := case
    when v_denominator = 0 then 0
    else round(((v_completed_habits + case when v_has_workout then 1 else 0 end + case when v_has_journal then 1 else 0 end)::numeric / v_denominator::numeric) * 100)::integer
  end;

  insert into public.daily_scores (
    user_id,
    score_date,
    xp,
    completion_percent,
    completed_habits,
    total_habits,
    has_workout,
    has_journal,
    streak_count,
    updated_at
  )
  values (
    p_user_id,
    p_date,
    v_xp,
    v_completion,
    v_completed_habits,
    v_total_habits,
    v_has_workout,
    v_has_journal,
    0,
    now()
  )
  on conflict (user_id, score_date)
  do update set
    xp = excluded.xp,
    completion_percent = excluded.completion_percent,
    completed_habits = excluded.completed_habits,
    total_habits = excluded.total_habits,
    has_workout = excluded.has_workout,
    has_journal = excluded.has_journal,
    updated_at = now()
  returning * into v_score;

  v_streak := public.calculate_show_up_streak(p_user_id, p_date);

  update public.daily_scores
  set streak_count = v_streak
  where id = v_score.id
  returning * into v_score;

  perform public.unlock_achievements_for_day(p_user_id, p_date);

  return to_jsonb(v_score);
end;
$$;

create or replace function public.toggle_habit_completion(
  p_user_id uuid,
  p_habit_id uuid,
  p_date date,
  p_completed boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_habit_exists boolean;
begin
  select exists (
    select 1 from public.habits
    where id = p_habit_id and user_id = p_user_id and is_archived = false
  ) into v_habit_exists;

  if not v_habit_exists then
    raise exception 'Habit not found';
  end if;

  if p_completed then
    insert into public.habit_completions (user_id, habit_id, completed_date, xp_awarded)
    values (p_user_id, p_habit_id, p_date, 10)
    on conflict (user_id, habit_id, completed_date)
    do update set completed_at = excluded.completed_at;
  else
    delete from public.habit_completions
    where user_id = p_user_id and habit_id = p_habit_id and completed_date = p_date;
  end if;

  return public.sync_daily_score(p_user_id, p_date);
end;
$$;

create or replace function public.save_workout_log(
  p_user_id uuid,
  p_date date,
  p_type text,
  p_duration_minutes integer,
  p_notes text,
  p_exercises jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_workout_id uuid;
  v_xp integer;
  v_exercise jsonb;
  v_index integer := 0;
begin
  if char_length(trim(p_type)) = 0 then
    raise exception 'Workout type is required';
  end if;

  select case
    when exists (select 1 from public.workouts where user_id = p_user_id and workout_date = p_date) then 0
    else 25
  end into v_xp;

  insert into public.workouts (user_id, workout_date, type, duration_minutes, notes, xp_awarded)
  values (p_user_id, p_date, trim(p_type), p_duration_minutes, nullif(trim(coalesce(p_notes, '')), ''), v_xp)
  returning id into v_workout_id;

  for v_exercise in select * from jsonb_array_elements(coalesce(p_exercises, '[]'::jsonb))
  loop
    if char_length(trim(coalesce(v_exercise->>'name', ''))) > 0 then
      insert into public.exercise_entries (
        user_id,
        workout_id,
        name,
        sets,
        reps,
        weight,
        unit,
        sort_order
      )
      values (
        p_user_id,
        v_workout_id,
        trim(v_exercise->>'name'),
        greatest(coalesce((v_exercise->>'sets')::integer, 1), 1),
        greatest(coalesce((v_exercise->>'reps')::integer, 1), 1),
        nullif(v_exercise->>'weight', '')::numeric,
        nullif(v_exercise->>'unit', ''),
        v_index
      );
      v_index := v_index + 1;
    end if;
  end loop;

  return public.sync_daily_score(p_user_id, p_date);
end;
$$;

create or replace function public.save_journal_entry(
  p_user_id uuid,
  p_date date,
  p_content text,
  p_mood text,
  p_tags text[]
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_existing public.journal_entries%rowtype;
  v_xp integer := 15;
begin
  if char_length(trim(p_content)) = 0 then
    raise exception 'Journal content is required';
  end if;

  select * into v_existing
  from public.journal_entries
  where user_id = p_user_id and entry_date = p_date;

  if found then
    v_xp := v_existing.xp_awarded;
  end if;

  insert into public.journal_entries (user_id, entry_date, content, mood, tags, xp_awarded)
  values (p_user_id, p_date, trim(p_content), nullif(trim(coalesce(p_mood, '')), ''), coalesce(p_tags, '{}'), v_xp)
  on conflict (user_id, entry_date)
  do update set
    content = excluded.content,
    mood = excluded.mood,
    tags = excluded.tags,
    updated_at = now()
  returning * into v_existing;

  return public.sync_daily_score(p_user_id, p_date);
end;
$$;

revoke execute on function public.toggle_habit_completion(uuid, uuid, date, boolean) from anon, authenticated;
revoke execute on function public.save_workout_log(uuid, date, text, integer, text, jsonb) from anon, authenticated;
revoke execute on function public.save_journal_entry(uuid, date, text, text, text[]) from anon, authenticated;
revoke execute on function public.sync_daily_score(uuid, date) from anon, authenticated;
grant execute on function public.toggle_habit_completion(uuid, uuid, date, boolean) to service_role;
grant execute on function public.save_workout_log(uuid, date, text, integer, text, jsonb) to service_role;
grant execute on function public.save_journal_entry(uuid, date, text, text, text[]) to service_role;
grant execute on function public.sync_daily_score(uuid, date) to service_role;
