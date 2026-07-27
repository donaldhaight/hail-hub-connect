CREATE INDEX IF NOT EXISTS dossier_section_reads_dossier_user_idx ON public.dossier_section_reads (dossier_slug, user_id);

CREATE TABLE public.dossier_attachment_opens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attachment_id uuid NOT NULL REFERENCES public.dossier_attachments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dossier_slug text NOT NULL,
  opened_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, DELETE ON public.dossier_attachment_opens TO authenticated;
GRANT ALL ON public.dossier_attachment_opens TO service_role;

ALTER TABLE public.dossier_attachment_opens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Insiders can create their own attachment open records"
  ON public.dossier_attachment_opens
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Founders can read all attachment open records"
  ON public.dossier_attachment_opens
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'founder_admin'));

CREATE INDEX IF NOT EXISTS dossier_attachment_opens_attachment_idx ON public.dossier_attachment_opens (attachment_id, opened_at DESC);
CREATE INDEX IF NOT EXISTS dossier_attachment_opens_user_idx ON public.dossier_attachment_opens (user_id, opened_at DESC);
CREATE INDEX IF NOT EXISTS dossier_attachment_opens_dossier_idx ON public.dossier_attachment_opens (dossier_slug, opened_at DESC);