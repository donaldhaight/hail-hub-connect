revoke execute on function public.get_attendee_view(uuid) from authenticated;
revoke execute on function public.get_ticket_view(uuid) from authenticated;
revoke execute on function public.update_attendee_details(uuid, integer, boolean, text, text) from authenticated;