CREATE TABLE public.insider_access_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  dossier_slug text NOT NULL,
  opened_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX insider_access_log_user_idx ON public.insider_access_log(user_id, opened_at DESC);
CREATE INDEX insider_access_log_slug_idx ON public.insider_access_log(dossier_slug, opened_at DESC);

GRANT SELECT, INSERT ON public.insider_access_log TO authenticated;
GRANT ALL ON public.insider_access_log TO service_role;

ALTER TABLE public.insider_access_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Insiders can log their own opens"
  ON public.insider_access_log
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND (
      public.has_role(auth.uid(), 'qualified_insider'::app_role)
      OR public.has_role(auth.uid(), 'founder_admin'::app_role)
    )
  );

CREATE POLICY "Founder admins can read all access logs"
  ON public.insider_access_log
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'founder_admin'::app_role));

CREATE POLICY "Users can read their own access log"
  ON public.insider_access_log
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);