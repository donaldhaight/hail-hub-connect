-- Ladder fields on conference applications
ALTER TABLE public.conference_applications
  ADD COLUMN IF NOT EXISTS delegate_seat_status text NOT NULL DEFAULT 'not_issued',
  ADD COLUMN IF NOT EXISTS second_congress_credential uuid NOT NULL DEFAULT gen_random_uuid();

ALTER TABLE public.conference_applications
  ADD CONSTRAINT conference_applications_second_congress_credential_key UNIQUE (second_congress_credential);

-- Demo script table for the Situation Room
CREATE TABLE IF NOT EXISTS public.room_demo_script (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  position integer NOT NULL UNIQUE,
  prompt text NOT NULL,
  lens text,
  scenario_slug text,
  layout text,
  speaking_note text,
  truth_label text NOT NULL DEFAULT 'ASSERTION',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.room_demo_script TO authenticated;
GRANT ALL ON public.room_demo_script TO service_role;
ALTER TABLE public.room_demo_script ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read demo script"
  ON public.room_demo_script FOR SELECT TO authenticated USING (true);

CREATE POLICY "Founder admins can manage demo script"
  ON public.room_demo_script FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'founder_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'founder_admin'));

CREATE TRIGGER update_room_demo_script_updated_at
  BEFORE UPDATE ON public.room_demo_script
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Mark Hurricane Beryl as the production demo scenario
UPDATE public.room_scenarios
   SET is_production = true,
       note = 'Landfall near Matagorda, 08 July 2024. Footprint counties are real; every value on this scenario is modeled for demonstration and treated as production for the First Congress demo.'
 WHERE slug = 'beryl-2024';

-- Seed the One Prompt Event demo script
INSERT INTO public.room_demo_script (position, prompt, lens, scenario_slug, layout, speaking_note, truth_label)
VALUES
  (1, 'Show me the overall coordination picture after Hurricane Beryl', 'Center', 'beryl-2024', 'board', 'Open on the Center lens. State the question: does supply match demand across all six functions?', 'ASSERTION'),
  (2, 'How much capital is staged against the work not yet done in Harris County?', 'Banking', 'beryl-2024', 'map', 'Switch to Banking and zoom to Harris County. Ask the room where the dollars are relative to the roofs.', 'ASSERTION'),
  (3, 'Show me the claims in flight and the disputes open', 'Insurance', 'beryl-2024', 'table', 'Move to Insurance. Highlight claims_in_flight and disputes_open. This is the tension the market pays for.', 'FACT'),
  (4, 'Is there enough crew capacity within reach of the damage?', 'Construction', 'beryl-2024', 'board', 'Switch to Construction. Compare crews_available to roofs_impacted. Name the gap.', 'ASSERTION'),
  (5, 'Show me the governance view: who is obligated here?', 'Foundation', 'beryl-2024', 'table', 'Close on Foundation. Delegates committed and counties touched. The Human Blockchain is a coordination claim, not a technology claim.', 'ASSERTION');

-- Update get_ticket_view to expose the new ladder fields
CREATE OR REPLACE FUNCTION public.get_ticket_view(_credential uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
    'seatStatus', row.seat_status,
    'delegateSeatStatus', row.delegate_seat_status,
    'secondCongressCredential', row.second_congress_credential
  );
END;
$function$;

-- Lock down the recreated SECURITY DEFINER function
REVOKE EXECUTE ON FUNCTION public.get_ticket_view(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_ticket_view(uuid) TO service_role;