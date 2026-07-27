
ALTER TABLE public.insider_invitations
  ADD COLUMN IF NOT EXISTS source text,
  ADD COLUMN IF NOT EXISTS revoked_at timestamptz,
  ADD COLUMN IF NOT EXISTS full_name text,
  ADD COLUMN IF NOT EXISTS organization text,
  ADD COLUMN IF NOT EXISTS role_category text,
  ADD COLUMN IF NOT EXISTS internal_note text;

UPDATE public.insider_invitations
   SET source = CASE
     WHEN briefing_request_id IS NOT NULL THEN 'briefing'
     WHEN conference_application_id IS NOT NULL THEN 'conference'
     ELSE 'direct'
   END
 WHERE source IS NULL;

ALTER TABLE public.insider_invitations
  ALTER COLUMN source SET NOT NULL,
  ALTER COLUMN source SET DEFAULT 'direct';

ALTER TABLE public.insider_invitations
  DROP CONSTRAINT IF EXISTS insider_invitations_one_source;

ALTER TABLE public.insider_invitations
  ADD CONSTRAINT insider_invitations_source_shape CHECK (
    (source = 'briefing'   AND briefing_request_id IS NOT NULL AND conference_application_id IS NULL)
 OR (source = 'conference' AND conference_application_id IS NOT NULL AND briefing_request_id IS NULL)
 OR (source = 'direct'     AND briefing_request_id IS NULL AND conference_application_id IS NULL)
  );

CREATE INDEX IF NOT EXISTS insider_invitations_status_idx ON public.insider_invitations(status);
CREATE INDEX IF NOT EXISTS insider_invitations_email_idx ON public.insider_invitations(lower(email));
