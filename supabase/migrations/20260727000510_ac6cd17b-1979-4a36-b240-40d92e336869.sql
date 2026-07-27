-- dossier_notes: founder-authored annotations
CREATE TABLE public.dossier_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dossier_slug text NOT NULL,
  section_heading text,
  body text NOT NULL,
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.dossier_notes TO authenticated;
GRANT ALL ON public.dossier_notes TO service_role;

ALTER TABLE public.dossier_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notes_select_insiders_or_founder"
  ON public.dossier_notes FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'qualified_insider')
    OR public.has_role(auth.uid(), 'founder_admin')
  );

CREATE POLICY "notes_insert_founder"
  ON public.dossier_notes FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'founder_admin')
    AND author_id = auth.uid()
  );

CREATE POLICY "notes_update_founder"
  ON public.dossier_notes FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'founder_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'founder_admin'));

CREATE POLICY "notes_delete_founder"
  ON public.dossier_notes FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'founder_admin'));

CREATE TRIGGER update_dossier_notes_updated_at
  BEFORE UPDATE ON public.dossier_notes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX dossier_notes_slug_idx ON public.dossier_notes(dossier_slug, created_at DESC);

-- dossier_messages: insider Q&A
CREATE TABLE public.dossier_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dossier_slug text NOT NULL,
  section_heading text,
  body text NOT NULL,
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.dossier_messages TO authenticated;
GRANT ALL ON public.dossier_messages TO service_role;

ALTER TABLE public.dossier_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "msg_select_insiders_or_founder"
  ON public.dossier_messages FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'qualified_insider')
    OR public.has_role(auth.uid(), 'founder_admin')
  );

CREATE POLICY "msg_insert_insiders_or_founder"
  ON public.dossier_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    author_id = auth.uid()
    AND (
      public.has_role(auth.uid(), 'qualified_insider')
      OR public.has_role(auth.uid(), 'founder_admin')
    )
  );

CREATE POLICY "msg_update_author_or_founder"
  ON public.dossier_messages FOR UPDATE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'founder_admin')
    OR (author_id = auth.uid() AND created_at > now() - interval '15 minutes')
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'founder_admin')
    OR (author_id = auth.uid() AND created_at > now() - interval '15 minutes')
  );

CREATE POLICY "msg_delete_author_or_founder"
  ON public.dossier_messages FOR DELETE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'founder_admin')
    OR (author_id = auth.uid() AND created_at > now() - interval '15 minutes')
  );

CREATE INDEX dossier_messages_slug_idx ON public.dossier_messages(dossier_slug, created_at ASC);
CREATE INDEX dossier_messages_recent_idx ON public.dossier_messages(created_at DESC);