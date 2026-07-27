
-- =========================================================
-- Track 1: dossier_attachments
-- =========================================================
CREATE TABLE public.dossier_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dossier_slug text NOT NULL REFERENCES public.dossiers(slug) ON DELETE CASCADE,
  section_id uuid REFERENCES public.dossier_sections(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('file','link')),
  storage_path text,
  external_url text,
  title text NOT NULL,
  description text,
  mime_type text,
  size_bytes bigint,
  is_published boolean NOT NULL DEFAULT false,
  position integer NOT NULL DEFAULT 0,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (
    (kind = 'file' AND storage_path IS NOT NULL) OR
    (kind = 'link' AND external_url IS NOT NULL)
  )
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.dossier_attachments TO authenticated;
GRANT ALL ON public.dossier_attachments TO service_role;

ALTER TABLE public.dossier_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Founders manage all attachments"
  ON public.dossier_attachments FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'founder_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'founder_admin'));

CREATE POLICY "Insiders read published attachments"
  ON public.dossier_attachments FOR SELECT
  TO authenticated
  USING (
    is_published = true
    AND public.has_role(auth.uid(), 'qualified_insider')
  );

CREATE INDEX dossier_attachments_dossier_idx ON public.dossier_attachments(dossier_slug, position);
CREATE INDEX dossier_attachments_section_idx ON public.dossier_attachments(section_id);

CREATE TRIGGER update_dossier_attachments_updated_at
  BEFORE UPDATE ON public.dossier_attachments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage policies for the dossier-artifacts bucket (bucket itself created via tool).
CREATE POLICY "Founders manage dossier artifacts objects"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'dossier-artifacts' AND public.has_role(auth.uid(), 'founder_admin'))
  WITH CHECK (bucket_id = 'dossier-artifacts' AND public.has_role(auth.uid(), 'founder_admin'));

-- =========================================================
-- Track 2: insider_referrals
-- =========================================================
CREATE TABLE public.insider_referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nominee_name text NOT NULL,
  nominee_email text NOT NULL,
  nominee_organization text,
  nominee_role text,
  context text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','declined','invited')),
  founder_note text,
  resulting_invitation_id uuid REFERENCES public.insider_invitations(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.insider_referrals TO authenticated;
GRANT ALL ON public.insider_referrals TO service_role;

ALTER TABLE public.insider_referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Founders manage all referrals"
  ON public.insider_referrals FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'founder_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'founder_admin'));

CREATE POLICY "Insiders insert own referrals"
  ON public.insider_referrals FOR INSERT
  TO authenticated
  WITH CHECK (
    referrer_id = auth.uid()
    AND public.has_role(auth.uid(), 'qualified_insider')
  );

CREATE POLICY "Insiders read own referrals"
  ON public.insider_referrals FOR SELECT
  TO authenticated
  USING (referrer_id = auth.uid());

CREATE INDEX insider_referrals_referrer_idx ON public.insider_referrals(referrer_id, created_at DESC);
CREATE INDEX insider_referrals_status_idx ON public.insider_referrals(status, created_at DESC);

CREATE TRIGGER update_insider_referrals_updated_at
  BEFORE UPDATE ON public.insider_referrals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- Track 3: dossier_section_reads
-- =========================================================
CREATE TABLE public.dossier_section_reads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dossier_slug text NOT NULL REFERENCES public.dossiers(slug) ON DELETE CASCADE,
  section_id uuid NOT NULL REFERENCES public.dossier_sections(id) ON DELETE CASCADE,
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  dwell_ms bigint NOT NULL DEFAULT 0,
  read_confirmed_at timestamptz,
  UNIQUE (user_id, section_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.dossier_section_reads TO authenticated;
GRANT ALL ON public.dossier_section_reads TO service_role;

ALTER TABLE public.dossier_section_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Founders read all section reads"
  ON public.dossier_section_reads FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'founder_admin'));

CREATE POLICY "Insiders manage own section reads"
  ON public.dossier_section_reads FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE INDEX dossier_section_reads_dossier_idx ON public.dossier_section_reads(dossier_slug);
CREATE INDEX dossier_section_reads_section_idx ON public.dossier_section_reads(section_id);
