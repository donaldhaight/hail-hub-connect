REVOKE EXECUTE ON FUNCTION public.get_attendee_view(uuid) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.update_attendee_details(uuid, integer, boolean, text, text) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.get_ticket_view(uuid) FROM authenticated;