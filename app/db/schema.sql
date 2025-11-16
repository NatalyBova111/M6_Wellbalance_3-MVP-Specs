-- UUID + helper
create extension if not exists "uuid-ossp";
create or replace function public.uid() returns uuid language sql stable as $$ select auth.uid() $$;

-- PROFILES (1-1 с auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- DAILY CORE
create table public.daily_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  log_date date not null,
  total_calories integer,
  protein_g integer,
  carbs_g integer,
  fat_g integer,
  unique(user_id, log_date)
);

create table public.meals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  log_id uuid not null references public.daily_logs(id) on delete cascade,
  meal_type text not null check (meal_type in ('breakfast','lunch','dinner','snack')),
  note text,
  created_at timestamptz not null default now()
);

create table public.foods (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references public.profiles(id) on delete set null,
  name text not null,
  brand text,
  serving_unit text not null default 'g',
  serving_qty numeric not null default 100,
  calories_per_serving integer,
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.meal_items (
  id uuid primary key default uuid_generate_v4(),
  meal_id uuid not null references public.meals(id) on delete cascade,
  food_id uuid not null references public.foods(id),
  qty numeric not null check (qty > 0),
  calories_total integer
);

create table public.water_intake (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  log_date date not null,
  ml integer not null check (ml >= 0)
);

create table if not exists public.sleep_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  date_on date not null,
  bedtime time,
  wake_time time,
  total_sleep_hours numeric,
  quality_score integer check (quality_score between 0 and 100),
  note text,
  unique(user_id, date_on)
);

-- RLS
alter table public.profiles enable row level security;
alter table public.daily_logs enable row level security;
alter table public.meals enable row level security;
alter table public.meal_items enable row level security;
alter table public.foods enable row level security;
alter table public.water_intake enable row level security;
alter table public.sleep_logs enable row level security;

create policy "profiles: read own" on public.profiles
for select using (id = public.uid());
create policy "profiles: update own" on public.profiles
for update using (id = public.uid());

create policy "daily_logs own" on public.daily_logs
for all using (user_id = public.uid()) with check (user_id = public.uid());

create policy "meals own" on public.meals
for all using (user_id = public.uid()) with check (user_id = public.uid());

create policy "meal_items via meal owner" on public.meal_items
for all using (
  exists (select 1 from public.meals m where m.id = meal_items.meal_id and m.user_id = public.uid())
) with check (
  exists (select 1 from public.meals m where m.id = meal_items.meal_id and m.user_id = public.uid())
);

create policy "foods read public/own" on public.foods
for select using (is_public or owner_id = public.uid());
create policy "foods owner all" on public.foods
for all using (owner_id = public.uid()) with check (owner_id = public.uid());

create policy "water own" on public.water_intake
for all using (user_id = public.uid()) with check (user_id = public.uid());

create policy "sleep own" on public.sleep_logs
for all using (user_id = public.uid()) with check (user_id = public.uid());

-- Seed: 3 продукта для быстрого теста
insert into public.foods (owner_id, name, brand, serving_unit, serving_qty, calories_per_serving, is_public) values
  (null,'Grilled Chicken Breast','Generic','g',100,165,true),
  (null,'Brown Rice (cooked)','Generic','g',100,112,true),
  (null,'Avocado','Generic','g',100,160,true)
on conflict do nothing;
