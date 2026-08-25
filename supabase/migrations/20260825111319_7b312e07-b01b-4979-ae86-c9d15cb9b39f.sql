ALTER TABLE public.manual_chapters
  ADD COLUMN IF NOT EXISTS draft_status text NOT NULL DEFAULT 'outline',
  ADD COLUMN IF NOT EXISTS pull_quote text,
  ADD COLUMN IF NOT EXISTS provenance_note text;

CREATE OR REPLACE FUNCTION public.manual_chapters_validate_draft_status()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.draft_status NOT IN ('outline','drafting','review','final') THEN
    RAISE EXCEPTION 'invalid draft_status: %', NEW.draft_status;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS manual_chapters_draft_status_check ON public.manual_chapters;
CREATE TRIGGER manual_chapters_draft_status_check
BEFORE INSERT OR UPDATE ON public.manual_chapters
FOR EACH ROW EXECUTE FUNCTION public.manual_chapters_validate_draft_status();