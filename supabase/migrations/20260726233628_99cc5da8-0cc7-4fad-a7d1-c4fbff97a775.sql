ALTER TABLE public.insider_invitations
  ADD COLUMN IF NOT EXISTS conference_application_id uuid REFERENCES public.conference_applications(id) ON DELETE SET NULL;

ALTER TABLE public.insider_invitations
  ALTER COLUMN briefing_request_id DROP NOT NULL;

ALTER TABLE public.insider_invitations
  DROP CONSTRAINT IF EXISTS insider_invitations_one_source;

ALTER TABLE public.insider_invitations
  ADD CONSTRAINT insider_invitations_one_source
  CHECK (
    (briefing_request_id IS NOT NULL AND conference_application_id IS NULL)
    OR (briefing_request_id IS NULL AND conference_application_id IS NOT NULL)
  );

CREATE INDEX IF NOT EXISTS insider_invitations_conf_app_idx
  ON public.insider_invitations(conference_application_id);