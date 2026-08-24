
CREATE TABLE public.manual_chapters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  part TEXT NOT NULL,
  position INTEGER NOT NULL,
  number_label TEXT,
  title TEXT NOT NULL,
  subtitle TEXT,
  truth TEXT NOT NULL DEFAULT 'OPEN',
  confidentiality TEXT NOT NULL DEFAULT 'C2',
  body TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX manual_chapters_order_idx ON public.manual_chapters (position);

CREATE TABLE public.manual_glossary (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  term TEXT NOT NULL UNIQUE,
  definition TEXT NOT NULL,
  see_also TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.manual_edits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_slug TEXT NOT NULL,
  field TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  edited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  edited_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX manual_edits_recent_idx ON public.manual_edits (edited_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.manual_chapters TO authenticated;
GRANT ALL ON public.manual_chapters TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.manual_glossary TO authenticated;
GRANT ALL ON public.manual_glossary TO service_role;
GRANT SELECT, INSERT ON public.manual_edits TO authenticated;
GRANT ALL ON public.manual_edits TO service_role;

ALTER TABLE public.manual_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manual_glossary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manual_edits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Insiders and founder can read manual chapters"
  ON public.manual_chapters FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'qualified_insider') OR public.has_role(auth.uid(), 'founder_admin'));
CREATE POLICY "Founder can write manual chapters"
  ON public.manual_chapters FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'founder_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'founder_admin'));

CREATE POLICY "Insiders and founder can read glossary"
  ON public.manual_glossary FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'qualified_insider') OR public.has_role(auth.uid(), 'founder_admin'));
CREATE POLICY "Founder can write glossary"
  ON public.manual_glossary FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'founder_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'founder_admin'));

CREATE POLICY "Founder can read manual edits"
  ON public.manual_edits FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'founder_admin'));
CREATE POLICY "Founder can log manual edits"
  ON public.manual_edits FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'founder_admin') AND edited_by = auth.uid());

CREATE TRIGGER manual_chapters_updated_at BEFORE UPDATE ON public.manual_chapters
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER manual_glossary_updated_at BEFORE UPDATE ON public.manual_glossary
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
