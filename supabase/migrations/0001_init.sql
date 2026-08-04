-- LoveDaily initial schema: growth-first (auth + usage analytics).
-- Run this once in the Supabase SQL editor (or via `supabase db push`)
-- after creating the project and enabling the Google auth provider.

-- ============================================================
-- profiles — extends auth.users with the fields product/growth need.
-- auth.users itself is managed by Supabase Auth and shouldn't be
-- altered directly.
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  name text,
  avatar_url text,
  country text,
  language text,
  created_at timestamptz not null default now(),
  last_login_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid () = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid () = id);

-- Auto-create a profile row whenever someone signs up via Supabase Auth.
create function public.handle_new_user () returns trigger as $$
begin
  insert into public.profiles (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users for each row
execute procedure public.handle_new_user ();

-- ============================================================
-- ai_requests — one row per generation. The single source of truth
-- usage stats and the admin dashboard are computed from.
-- ============================================================
create table public.ai_requests (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references public.profiles (id) on delete cascade,
  template_id text not null,
  tone text,
  language text,
  success boolean not null default true,
  created_at timestamptz not null default now()
);

create index ai_requests_user_id_idx on public.ai_requests (user_id);
create index ai_requests_created_at_idx on public.ai_requests (created_at);

alter table public.ai_requests enable row level security;

create policy "Users can view their own requests"
  on public.ai_requests for select
  using (auth.uid () = user_id);

create policy "Users can insert their own requests"
  on public.ai_requests for insert
  with check (auth.uid () = user_id);

-- ============================================================
-- feature_events — persisted funnel analytics (mirrors the events
-- tracked client-side via lib/analytics.ts). Written server-side only,
-- via the service-role client, so no RLS insert policy is needed here.
-- user_id is nullable since some events (e.g. "Landing Viewed") fire
-- before anyone signs in.
-- ============================================================
create table public.feature_events (
  id uuid primary key default gen_random_uuid (),
  user_id uuid references public.profiles (id) on delete set null,
  event_name text not null,
  properties jsonb,
  created_at timestamptz not null default now()
);

create index feature_events_event_name_idx on public.feature_events (event_name);
create index feature_events_created_at_idx on public.feature_events (created_at);

-- ============================================================
-- user_usage_stats — computed view (never manually synced, so it
-- can't drift from ai_requests / profiles).
-- ============================================================
create view public.user_usage_stats as
select
  p.id as user_id,
  p.email,
  p.created_at as first_visit,
  p.last_login_at as last_visit,
  count(r.id) as total_generations,
  max(r.created_at) as last_generation,
  count(distinct date_trunc('day', r.created_at)) as active_days,
  mode() within group (
    order by r.template_id
  ) as favorite_feature
from public.profiles p
left join public.ai_requests r on r.user_id = p.id
group by p.id, p.email, p.created_at, p.last_login_at;

-- ============================================================
-- system_logs — lightweight server-side event/error log.
-- ============================================================
create table public.system_logs (
  id uuid primary key default gen_random_uuid (),
  level text not null default 'info',
  message text not null,
  context jsonb,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Future monetization tables — schema exists now, unused until
-- Premium plans are introduced. Written to only by the (currently
-- inactive) Stripe integration already built in services/billing/.
-- ============================================================
create table public.subscriptions (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references public.profiles (id) on delete cascade,
  plan text not null,
  status text not null,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references public.profiles (id) on delete cascade,
  amount numeric not null,
  currency text not null default 'usd',
  status text not null,
  stripe_payment_id text,
  created_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;
alter table public.payments enable row level security;

create policy "Users can view their own subscriptions"
  on public.subscriptions for select
  using (auth.uid () = user_id);

create policy "Users can view their own payments"
  on public.payments for select
  using (auth.uid () = user_id);
