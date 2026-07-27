ALTER TABLE public.conference_applications
  ADD COLUMN IF NOT EXISTS seat_status text NOT NULL DEFAULT 'applied'
    CHECK (seat_status IN ('applied','invited','confirmed','waitlisted','declined','cancelled')),
  ADD COLUMN IF NOT EXISTS plus_ones integer NOT NULL DEFAULT 0 CHECK (plus_ones >= 0),
  ADD COLUMN IF NOT EXISTS dietary_restrictions text,
  ADD COLUMN IF NOT EXISTS hotel_needed boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS logistics_notes text,
  ADD COLUMN IF NOT EXISTS confirmed_at timestamp with time zone;

UPDATE public.conference_applications
SET seat_status = status
WHERE status IN ('applied','invited','confirmed','declined');

CREATE TABLE public.conference_seat_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.conference_applications(id) ON DELETE CASCADE,
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  note text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.conference_applications TO authenticated;
GRANT ALL ON public.conference_applications TO service_role;

GRANT SELECT, INSERT ON public.conference_seat_events TO authenticated;
GRANT ALL ON public.conference_seat_events TO service_role;

ALTER TABLE public.conference_seat_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Founder admins can read seat events" ON public.conference_seat_events FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'founder_admin'));
CREATE POLICY "Founder admins can insert seat events" ON public.conference_seat_events FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'founder_admin'));

CREATE TRIGGER update_conference_seat_events_updated_at BEFORE UPDATE ON public.conference_seat_events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();