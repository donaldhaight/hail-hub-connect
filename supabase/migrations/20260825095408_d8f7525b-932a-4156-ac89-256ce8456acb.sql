ALTER TABLE public.conference_applications
  ADD COLUMN IF NOT EXISTS ticket_tier text NOT NULL DEFAULT 'observer',
  ADD COLUMN IF NOT EXISTS ticket_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS ticket_credential uuid NOT NULL DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS season_id text NOT NULL DEFAULT 'first-congress';

ALTER TABLE public.conference_applications
  DROP CONSTRAINT IF EXISTS conference_applications_ticket_tier_check;
ALTER TABLE public.conference_applications
  ADD CONSTRAINT conference_applications_ticket_tier_check
  CHECK (ticket_tier IN ('observer','stakeholder'));

ALTER TABLE public.conference_applications
  DROP CONSTRAINT IF EXISTS conference_applications_ticket_status_check;
ALTER TABLE public.conference_applications
  ADD CONSTRAINT conference_applications_ticket_status_check
  CHECK (ticket_status IN ('pending','approved','declined','waitlisted'));

CREATE UNIQUE INDEX IF NOT EXISTS conference_applications_ticket_credential_key
  ON public.conference_applications (ticket_credential);

CREATE OR REPLACE FUNCTION public.get_ticket_view(_credential uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  row public.conference_applications%ROWTYPE;
BEGIN
  SELECT * INTO row FROM public.conference_applications
   WHERE ticket_credential = _credential;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_found');
  END IF;

  IF row.ticket_status <> 'approved' THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_approved',
                              'status', row.ticket_status);
  END IF;

  RETURN jsonb_build_object(
    'ok', true,
    'name', row.name,
    'organization', row.organization,
    'tier', row.ticket_tier,
    'seasonId', row.season_id,
    'seatStatus', row.seat_status
  );
END;
$$;

REVOKE ALL ON FUNCTION public.get_ticket_view(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.get_ticket_view(uuid) TO anon, authenticated, service_role;