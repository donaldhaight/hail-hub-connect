CREATE TABLE public.intake_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kind text NOT NULL DEFAULT 'file',
  storage_path text,
  external_url text,
  title text NOT NULL,
  original_date date,
  source_label text,
  notes text,
  layers text[] NOT NULL DEFAULT '{}',
  triage_state text NOT NULL DEFAULT 'new',
  filed_as text,
  filed_ref text,
  extracted_text text,
  mime_type text,
  size_bytes bigint,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.intake_items TO authenticated;
GRANT ALL ON public.intake_items TO service_role;
ALTER TABLE public.intake_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Founder manages intake" ON public.intake_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'founder_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'founder_admin'));

CREATE TRIGGER intake_items_updated_at BEFORE UPDATE ON public.intake_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.concept_tracks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  brief text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'exploring',
  layers text[] NOT NULL DEFAULT '{}',
  position integer NOT NULL DEFAULT 0,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.concept_tracks TO authenticated;
GRANT ALL ON public.concept_tracks TO service_role;
ALTER TABLE public.concept_tracks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Founder manages tracks" ON public.concept_tracks FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'founder_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'founder_admin'));

CREATE TRIGGER concept_tracks_updated_at BEFORE UPDATE ON public.concept_tracks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.concept_track_notes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  track_id uuid NOT NULL REFERENCES public.concept_tracks(id) ON DELETE CASCADE,
  kind text NOT NULL DEFAULT 'note',
  body text NOT NULL,
  resolved boolean NOT NULL DEFAULT false,
  position integer NOT NULL DEFAULT 0,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.concept_track_notes TO authenticated;
GRANT ALL ON public.concept_track_notes TO service_role;
ALTER TABLE public.concept_track_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Founder manages track notes" ON public.concept_track_notes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'founder_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'founder_admin'));

CREATE TRIGGER concept_track_notes_updated_at BEFORE UPDATE ON public.concept_track_notes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.manual_attachments ADD COLUMN IF NOT EXISTS layers text[] NOT NULL DEFAULT '{}';
ALTER TABLE public.manual_attachments ADD COLUMN IF NOT EXISTS extracted_text text;
ALTER TABLE public.dossier_attachments ADD COLUMN IF NOT EXISTS layers text[] NOT NULL DEFAULT '{}';
ALTER TABLE public.dossier_attachments ADD COLUMN IF NOT EXISTS extracted_text text;

CREATE INDEX intake_items_triage_idx ON public.intake_items (triage_state, created_at DESC);
CREATE INDEX intake_items_text_idx ON public.intake_items USING gin (to_tsvector('english', coalesce(title,'') || ' ' || coalesce(notes,'') || ' ' || coalesce(extracted_text,'')));