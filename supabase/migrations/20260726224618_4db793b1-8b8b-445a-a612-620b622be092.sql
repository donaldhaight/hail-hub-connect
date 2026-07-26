-- Role system (required for the founder-admin review gate)
create type public.app_role as enum (
  'founder_admin',
  'counsel',
  'rrca_exec',
  'investor_prospect',
  'sponsor_prospect',
  'strategic_partner',
  'specialist_advisor',
  'system_auditor'
);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

create policy "Users can read own roles"
  on public.user_roles
  for select
  to authenticated
  using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- Shared updated-at trigger helper
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Briefing request capture
create table public.briefing_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  organization text not null,
  title text not null,
  interest text not null,
  context text,
  acknowledged boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'approved', 'declined')),
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant insert on public.briefing_requests to anon;
grant select, update on public.briefing_requests to authenticated;
grant all on public.briefing_requests to service_role;

alter table public.briefing_requests enable row level security;

create policy "Anyone can submit a briefing request"
  on public.briefing_requests
  for insert
  to anon
  with check (true);

create policy "Founder admins can manage briefing requests"
  on public.briefing_requests
  for all
  to authenticated
  using (public.has_role(auth.uid(), 'founder_admin'))
  with check (public.has_role(auth.uid(), 'founder_admin'));

create trigger update_briefing_requests_updated_at
  before update on public.briefing_requests
  for each row
  execute function public.update_updated_at_column();

-- Conference application capture
create table public.conference_applications (
  id uuid primary key default gen_random_uuid(),
  briefing_request_id uuid references public.briefing_requests(id) on delete set null,
  name text not null,
  email text not null,
  organization text not null,
  title text not null,
  interest text not null,
  context text,
  acknowledged boolean not null default false,
  status text not null default 'applied' check (status in ('applied', 'invited', 'confirmed', 'declined')),
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant insert on public.conference_applications to anon;
grant select, update on public.conference_applications to authenticated;
grant all on public.conference_applications to service_role;

alter table public.conference_applications enable row level security;

create policy "Anyone can submit a conference application"
  on public.conference_applications
  for insert
  to anon
  with check (true);

create policy "Founder admins can manage conference applications"
  on public.conference_applications
  for all
  to authenticated
  using (public.has_role(auth.uid(), 'founder_admin'))
  with check (public.has_role(auth.uid(), 'founder_admin'));

create trigger update_conference_applications_updated_at
  before update on public.conference_applications
  for each row
  execute function public.update_updated_at_column();

-- Audit log for founder actions
create table public.briefing_request_events (
  id uuid primary key default gen_random_uuid(),
  briefing_request_id uuid not null references public.briefing_requests(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  note text,
  created_at timestamptz not null default now()
);

grant select, insert on public.briefing_request_events to authenticated;
grant all on public.briefing_request_events to service_role;

alter table public.briefing_request_events enable row level security;

create policy "Founder admins can manage briefing request events"
  on public.briefing_request_events
  for all
  to authenticated
  using (public.has_role(auth.uid(), 'founder_admin'))
  with check (public.has_role(auth.uid(), 'founder_admin'));