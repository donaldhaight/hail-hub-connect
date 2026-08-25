CREATE TABLE public.broadcast_config (
  id text PRIMARY KEY DEFAULT 'default',
  provider text NOT NULL DEFAULT 'youtube',
  stream_id text,
  embed_url text,
  replay_url text,
  fallback_message text NOT NULL DEFAULT 'The stream will appear here when the session opens.',
  state text NOT NULL DEFAULT 'scheduled',
  started_at timestamp with time zone,
  ended_at timestamp with time zone,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid,
  CONSTRAINT broadcast_config_state_check CHECK (state IN ('scheduled', 'rehearsing', 'live', 'ended')),
  CONSTRAINT broadcast_config_provider_check CHECK (provider IN ('youtube', 'vimeo', 'other'))
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.broadcast_config TO authenticated;
GRANT ALL ON public.broadcast_config TO service_role;

ALTER TABLE public.broadcast_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Founders can manage broadcast config"
  ON public.broadcast_config
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'founder_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'founder_admin'));

CREATE TABLE public.broadcast_checklist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_key text NOT NULL UNIQUE,
  label text NOT NULL,
  checked_at timestamp with time zone,
  checked_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.broadcast_checklist TO authenticated;
GRANT ALL ON public.broadcast_checklist TO service_role;

ALTER TABLE public.broadcast_checklist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Founders can manage broadcast checklist"
  ON public.broadcast_checklist
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'founder_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'founder_admin'));

ALTER TABLE public.conference_itinerary_items
  ADD COLUMN segment_type text DEFAULT 'segment',
  ADD COLUMN speaker text,
  ADD COLUMN duration_minutes integer;

CREATE TRIGGER update_broadcast_config_updated_at
  BEFORE UPDATE ON public.broadcast_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_broadcast_checklist_updated_at
  BEFORE UPDATE ON public.broadcast_checklist
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.broadcast_checklist (item_key, label)
VALUES
  ('stream_provider', 'Stream provider configured'),
  ('run_of_show', 'Run of show published'),
  ('manual_aligned', 'Owner''s Manual chapters aligned'),
  ('ticket_breakdown', 'Ticket count and tier breakdown reviewed'),
  ('test_credential', 'Test credential link opened successfully'),
  ('rehearsal_completed', 'Rehearsal completed'),
  ('fallback_message', 'Fallback message set');

INSERT INTO public.broadcast_config (id, provider, fallback_message, state)
VALUES ('default', 'youtube', 'The stream will appear here when the session opens.', 'scheduled');