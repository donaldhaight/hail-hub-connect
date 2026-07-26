-- Remove direct anon insert access on capture tables
revoke insert on public.briefing_requests from anon;
revoke insert on public.conference_applications from anon;

-- Drop the permissive anon insert policies
drop policy if exists "Anyone can submit a briefing request" on public.briefing_requests;
drop policy if exists "Anyone can submit a conference application" on public.conference_applications;

-- Keep has_role usable by authenticated users in RLS policies, but not callable by anonymous visitors
revoke execute on function public.has_role(uuid, public.app_role) from anon;
grant execute on function public.has_role(uuid, public.app_role) to authenticated;