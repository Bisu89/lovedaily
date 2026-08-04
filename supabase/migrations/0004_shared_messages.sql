-- Shareable Love Cards: one row per generated message that gets its own
-- public URL (/message/[id]) and social preview image. `id` is the public
-- share slug — an unguessable UUID, not a sequential/enumerable key.

create table public.shared_messages (
  id uuid primary key default gen_random_uuid (),
  content text not null,
  template_id text not null,
  relationship text,
  tone text,
  language text,
  user_id uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index shared_messages_created_at_idx on public.shared_messages (created_at desc);

-- RLS is enabled but no select policy is granted to anon/authenticated.
-- Access is exclusively via the service-role client on the server side
-- (app/message/[id]/page.tsx, its opengraph-image, and the PNG download
-- route) after looking up the exact id from the URL. This is deliberate:
-- granting `select using (true)` to the anon key would let anyone list
-- the entire table via the public REST API, not just fetch a known id —
-- defeating the "only whoever has the link can view it" model.
alter table public.shared_messages enable row level security;
