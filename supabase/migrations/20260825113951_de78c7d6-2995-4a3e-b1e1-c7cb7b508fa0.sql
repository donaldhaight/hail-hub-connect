ALTER TABLE public.dossier_attachments
  ADD COLUMN IF NOT EXISTS original_date DATE,
  ADD COLUMN IF NOT EXISTS source_label TEXT,
  ADD COLUMN IF NOT EXISTS significance TEXT;

CREATE TABLE IF NOT EXISTS public.manual_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_slug TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('file','link')),
  storage_path TEXT,
  external_url TEXT,
  title TEXT NOT NULL,
  description TEXT,
  original_date DATE,
  source_label TEXT,
  significance TEXT,
  mime_type TEXT,
  size_bytes BIGINT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  position INTEGER NOT NULL DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS manual_attachments_chapter_idx ON public.manual_attachments (chapter_slug, position);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.manual_attachments TO authenticated;
GRANT ALL ON public.manual_attachments TO service_role;
ALTER TABLE public.manual_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Insiders read published manual attachments"
ON public.manual_attachments FOR SELECT TO authenticated
USING (
  public.has_role(auth.uid(), 'founder_admin')
  OR (is_published AND public.has_role(auth.uid(), 'qualified_insider'))
);

CREATE POLICY "Founder manages manual attachments"
ON public.manual_attachments FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'founder_admin'))
WITH CHECK (public.has_role(auth.uid(), 'founder_admin'));

CREATE TRIGGER update_manual_attachments_updated_at
BEFORE UPDATE ON public.manual_attachments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.manual_attachment_opens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  attachment_id UUID NOT NULL REFERENCES public.manual_attachments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chapter_slug TEXT NOT NULL,
  opened_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS manual_attachment_opens_attachment_idx ON public.manual_attachment_opens (attachment_id);

GRANT SELECT, INSERT ON public.manual_attachment_opens TO authenticated;
GRANT ALL ON public.manual_attachment_opens TO service_role;
ALTER TABLE public.manual_attachment_opens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Readers record their own manual opens"
ON public.manual_attachment_opens FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Founder reads manual opens"
ON public.manual_attachment_opens FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'founder_admin') OR user_id = auth.uid());