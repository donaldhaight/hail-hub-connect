# Security memory

## App
Private mission/briefing site (PrepareAmerica / ClaimStore). Public marketing routes, token-gated attendee and ticket pages, and authenticated founder/insider surfaces backed by Lovable Cloud.

## Must never happen
- Attendee PII, ticket credentials, dossier corpus, or invitation tokens readable by unauthenticated API callers.
- Roles stored anywhere but `public.user_roles`; privilege checks must stay server-side.
- Service-role key reaching client code.

## Standing notes for scanners
- `public.has_role(uuid, app_role)` is intentionally EXECUTE-granted to `authenticated`. It is required by dozens of RLS policy expressions (evaluated as the invoking role) and only exposes the caller's own role state. Do not flag it.
- `public.redeem_insider_invitation(uuid)` is intentionally EXECUTE-granted to `authenticated`. It is a self-service redemption that requires `auth.uid()` and an email match against the invitation. Do not flag it.
- All other SECURITY DEFINER functions (`get_attendee_view`, `update_attendee_details`, `get_ticket_view`) and the trigger helpers are `service_role`-only and are invoked exclusively from trusted server functions.
- The Supabase linter may still report one aggregated warning for the two intentional functions above. This is expected and should be ignored at warning level.
