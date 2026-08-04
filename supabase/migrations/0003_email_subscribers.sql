-- Growth email list: anyone who enters an email via the EmailGate (before
-- generating) or EmailCapture (after a result). `email` is unique so
-- re-submitting the same address is a no-op, not a duplicate row.

create table public.email_subscribers (
  id uuid primary key default gen_random_uuid (),
  email text not null unique,
  source text not null default 'unknown',
  created_at timestamptz not null default now()
);

create index email_subscribers_created_at_idx on public.email_subscribers (created_at desc);

-- Written and read only by the service-role client (subscribeEmail service,
-- admin dashboard) — no public policies needed.
alter table public.email_subscribers enable row level security;
