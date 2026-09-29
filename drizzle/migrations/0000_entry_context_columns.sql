ALTER TABLE public.ledger_wallets ADD COLUMN IF NOT EXISTS entry_context jsonb;
ALTER TABLE public.briefing_requests ADD COLUMN IF NOT EXISTS entry_context jsonb;
COMMENT ON COLUMN public.ledger_wallets.entry_context IS 'ADR-032: write-once arrival context (seven keys). Record, never authority or compensation.';
COMMENT ON COLUMN public.briefing_requests.entry_context IS 'ADR-032: arrival context at time of request. Record, never authority or compensation.';