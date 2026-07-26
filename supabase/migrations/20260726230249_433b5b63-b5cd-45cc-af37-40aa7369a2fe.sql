CREATE INDEX IF NOT EXISTS idx_briefing_requests_status_created ON public.briefing_requests (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_briefing_requests_email ON public.briefing_requests (email);
CREATE INDEX IF NOT EXISTS idx_conference_applications_status_created ON public.conference_applications (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_briefing_request_events_request ON public.briefing_request_events (briefing_request_id, created_at DESC);