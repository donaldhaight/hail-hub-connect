
-- 1) Add attendee-facing columns
ALTER TABLE public.conference_applications
  ADD COLUMN IF NOT EXISTS access_token uuid UNIQUE DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS attendee_notes text;

-- Backfill any nulls (shouldn't be needed given DEFAULT, but safe)
UPDATE public.conference_applications SET access_token = gen_random_uuid() WHERE access_token IS NULL;
ALTER TABLE public.conference_applications ALTER COLUMN access_token SET NOT NULL;

-- 2) Itinerary table
CREATE TABLE IF NOT EXISTS public.conference_itinerary_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  position integer NOT NULL DEFAULT 0,
  time_label text NOT NULL,
  title text NOT NULL,
  description text,
  location text,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.conference_itinerary_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.conference_itinerary_items TO authenticated;
GRANT ALL ON public.conference_itinerary_items TO service_role;

ALTER TABLE public.conference_itinerary_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "itinerary_public_read"
  ON public.conference_itinerary_items FOR SELECT
  USING (is_published = true);

CREATE POLICY "itinerary_founder_read_all"
  ON public.conference_itinerary_items FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'founder_admin'));

CREATE POLICY "itinerary_founder_insert"
  ON public.conference_itinerary_items FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'founder_admin'));

CREATE POLICY "itinerary_founder_update"
  ON public.conference_itinerary_items FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'founder_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'founder_admin'));

CREATE POLICY "itinerary_founder_delete"
  ON public.conference_itinerary_items FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'founder_admin'));

CREATE TRIGGER update_conference_itinerary_updated_at
  BEFORE UPDATE ON public.conference_itinerary_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3) Public RPC: attendee view by token (no login)
CREATE OR REPLACE FUNCTION public.get_attendee_view(_token uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  row public.conference_applications%ROWTYPE;
BEGIN
  SELECT * INTO row FROM public.conference_applications WHERE access_token = _token;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_found');
  END IF;
  RETURN jsonb_build_object(
    'ok', true,
    'id', row.id,
    'name', row.name,
    'email', row.email,
    'organization', row.organization,
    'seatStatus', row.seat_status,
    'plusOnes', row.plus_ones,
    'hotelNeeded', row.hotel_needed,
    'dietaryRestrictions', row.dietary_restrictions,
    'attendeeNotes', row.attendee_notes,
    'confirmedAt', row.confirmed_at
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_attendee_view(uuid) TO anon, authenticated;

-- 4) Public RPC: attendee updates own details by token
CREATE OR REPLACE FUNCTION public.update_attendee_details(
  _token uuid,
  _plus_ones integer,
  _hotel_needed boolean,
  _dietary text,
  _notes text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  row public.conference_applications%ROWTYPE;
  clamped_plus_ones integer;
BEGIN
  SELECT * INTO row FROM public.conference_applications WHERE access_token = _token;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_found');
  END IF;
  IF row.seat_status <> 'confirmed' THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_confirmed');
  END IF;

  clamped_plus_ones := greatest(0, least(3, coalesce(_plus_ones, 0)));

  UPDATE public.conference_applications
     SET plus_ones = clamped_plus_ones,
         hotel_needed = coalesce(_hotel_needed, false),
         dietary_restrictions = nullif(btrim(coalesce(_dietary, '')), ''),
         attendee_notes = nullif(btrim(coalesce(_notes, '')), ''),
         updated_at = now()
   WHERE id = row.id;

  INSERT INTO public.conference_seat_events (application_id, actor_id, action, note)
  VALUES (row.id, null, 'attendee:self_update',
          format('plus_ones=%s hotel=%s', clamped_plus_ones, coalesce(_hotel_needed, false)));

  RETURN jsonb_build_object('ok', true, 'plusOnes', clamped_plus_ones);
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_attendee_details(uuid, integer, boolean, text, text) TO anon, authenticated;
