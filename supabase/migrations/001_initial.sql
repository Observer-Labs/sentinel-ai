-- Sentinel MVP Initial Schema
-- Run this in the Supabase SQL Editor

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  team_name text,
  industry text,
  whatsapp_number text,
  notification_frequency text default 'immediate' check (notification_frequency in ('immediate', 'daily', 'weekly')),
  notification_channels text[] default array['in_app', 'email'],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Competitors
create table if not exists public.competitors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  type text not null check (type in ('website', 'social', 'both')),
  website_url text,
  social_accounts jsonb default '[]'::jsonb,
  category text default 'General',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists competitors_user_id_idx on public.competitors(user_id);

-- Website monitors
create table if not exists public.website_monitors (
  id uuid primary key default gen_random_uuid(),
  competitor_id uuid not null references public.competitors(id) on delete cascade,
  url text not null,
  check_frequency text default 'daily' check (check_frequency in ('hourly', 'daily', 'weekly')),
  last_checked timestamptz,
  last_snapshot text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create index if not exists website_monitors_competitor_id_idx on public.website_monitors(competitor_id);
create index if not exists website_monitors_active_idx on public.website_monitors(is_active) where is_active = true;

-- Social metrics snapshots
create table if not exists public.social_metrics (
  id uuid primary key default gen_random_uuid(),
  competitor_id uuid not null references public.competitors(id) on delete cascade,
  platform text not null check (platform in ('instagram', 'twitter', 'linkedin', 'tiktok')),
  follower_count integer,
  engagement_rate float,
  last_post_date timestamptz,
  last_checked timestamptz default now(),
  created_at timestamptz default now()
);

create index if not exists social_metrics_competitor_id_idx on public.social_metrics(competitor_id);

-- Alerts
create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  competitor_id uuid not null references public.competitors(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('website_change', 'price_change', 'social_post', 'follower_change', 'engagement_change')),
  title text not null,
  description text,
  change_data jsonb,
  severity text default 'medium' check (severity in ('low', 'medium', 'high')),
  is_read boolean default false,
  snoozed_until timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists alerts_user_id_idx on public.alerts(user_id);
create index if not exists alerts_competitor_id_idx on public.alerts(competitor_id);
create index if not exists alerts_created_at_idx on public.alerts(created_at desc);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.competitors enable row level security;
alter table public.website_monitors enable row level security;
alter table public.social_metrics enable row level security;
alter table public.alerts enable row level security;

-- Profiles RLS
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Competitors RLS
create policy "Users can manage own competitors"
  on public.competitors for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Website monitors RLS
create policy "Users can manage monitors via competitor"
  on public.website_monitors for all
  using (
    competitor_id in (
      select id from public.competitors where user_id = auth.uid()
    )
  )
  with check (
    competitor_id in (
      select id from public.competitors where user_id = auth.uid()
    )
  );

-- Social metrics RLS
create policy "Users can manage social metrics via competitor"
  on public.social_metrics for all
  using (
    competitor_id in (
      select id from public.competitors where user_id = auth.uid()
    )
  )
  with check (
    competitor_id in (
      select id from public.competitors where user_id = auth.uid()
    )
  );

-- Alerts RLS
create policy "Users can manage own alerts"
  on public.alerts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Enable Realtime for alerts
alter publication supabase_realtime add table public.alerts;

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, team_name, industry)
  values (
    new.id,
    new.raw_user_meta_data->>'team_name',
    new.raw_user_meta_data->>'industry'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
