REVOKE ALL ON FUNCTION public.get_attendee_view(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_attendee_details(uuid, integer, boolean, text, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.get_ticket_view(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_attendee_view(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.update_attendee_details(uuid, integer, boolean, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_ticket_view(uuid) TO service_role;

REVOKE ALL ON FUNCTION public.redeem_insider_invitation(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.redeem_insider_invitation(uuid) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.manual_chapters_validate_draft_status() FROM PUBLIC, anon, authenticated;