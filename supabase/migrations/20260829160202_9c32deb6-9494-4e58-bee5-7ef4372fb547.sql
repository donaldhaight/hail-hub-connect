-- 1. TOKENS
CREATE TABLE public.ledger_tokens (
  code text PRIMARY KEY,
  name text NOT NULL,
  symbol text NOT NULL,
  peg_usd numeric NOT NULL DEFAULT 0,
  peg_note text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.ledger_tokens TO authenticated;
GRANT ALL ON public.ledger_tokens TO service_role;

ALTER TABLE public.ledger_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Insiders and founders read tokens"
  ON public.ledger_tokens FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'founder_admin')
    OR public.has_role(auth.uid(), 'qualified_insider')
  );

CREATE TRIGGER ledger_tokens_updated_at
  BEFORE UPDATE ON public.ledger_tokens
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. WALLETS
CREATE TABLE public.ledger_wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL DEFAULT 'interested_user',
  anchor text,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  label text NOT NULL DEFAULT 'Interested User',
  claimed_at timestamptz,
  claimed_from uuid REFERENCES public.ledger_wallets(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX ledger_wallets_anchor_key
  ON public.ledger_wallets (anchor) WHERE anchor IS NOT NULL;
CREATE UNIQUE INDEX ledger_wallets_user_kind_key
  ON public.ledger_wallets (user_id, kind) WHERE user_id IS NOT NULL;

GRANT SELECT ON public.ledger_wallets TO authenticated;
GRANT ALL ON public.ledger_wallets TO service_role;

ALTER TABLE public.ledger_wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Founders read all wallets"
  ON public.ledger_wallets FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'founder_admin')
    OR public.has_role(auth.uid(), 'qualified_insider')
    OR user_id = auth.uid()
  );

CREATE TRIGGER ledger_wallets_updated_at
  BEFORE UPDATE ON public.ledger_wallets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. ENTRIES (append-only)
CREATE TABLE public.ledger_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id uuid NOT NULL REFERENCES public.ledger_wallets(id) ON DELETE CASCADE,
  token_code text NOT NULL REFERENCES public.ledger_tokens(code),
  direction text NOT NULL,
  amount numeric NOT NULL,
  reason text NOT NULL,
  ref text NOT NULL DEFAULT '',
  memo text NOT NULL DEFAULT '',
  counterparty_wallet_id uuid REFERENCES public.ledger_wallets(id) ON DELETE SET NULL,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ledger_entries_wallet_idx ON public.ledger_entries (wallet_id, occurred_at DESC);
CREATE INDEX ledger_entries_occurred_idx ON public.ledger_entries (occurred_at DESC);

GRANT SELECT ON public.ledger_entries TO authenticated;
GRANT ALL ON public.ledger_entries TO service_role;

ALTER TABLE public.ledger_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Founders and insiders read entries"
  ON public.ledger_entries FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'founder_admin')
    OR public.has_role(auth.uid(), 'qualified_insider')
    OR EXISTS (
      SELECT 1 FROM public.ledger_wallets w
      WHERE w.id = ledger_entries.wallet_id AND w.user_id = auth.uid()
    )
  );

-- Append-only enforcement at the database level
CREATE OR REPLACE FUNCTION public.ledger_entries_append_only()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  RAISE EXCEPTION 'ledger_entries is append-only';
END;
$$;

CREATE TRIGGER ledger_entries_no_update
  BEFORE UPDATE ON public.ledger_entries
  FOR EACH ROW EXECUTE FUNCTION public.ledger_entries_append_only();

CREATE TRIGGER ledger_entries_no_delete
  BEFORE DELETE ON public.ledger_entries
  FOR EACH ROW EXECUTE FUNCTION public.ledger_entries_append_only();

CREATE OR REPLACE FUNCTION public.ledger_entries_validate()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.direction NOT IN ('credit','debit') THEN
    RAISE EXCEPTION 'invalid direction: %', NEW.direction;
  END IF;
  IF NEW.amount <= 0 THEN
    RAISE EXCEPTION 'amount must be positive';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER ledger_entries_validate_ins
  BEFORE INSERT ON public.ledger_entries
  FOR EACH ROW EXECUTE FUNCTION public.ledger_entries_validate();

-- 4. SEED TOKENS
INSERT INTO public.ledger_tokens (code, name, symbol, peg_usd, peg_note, position) VALUES
  ('JBK', 'JoeBack', 'JBK', 0.01, 'Peg pending founder decision. Placeholder for Season 1 demonstration only.', 1),
  ('CLAIMCOIN', 'ClaimCoin', 'CLC', 1.00, 'Peg pending founder decision. Placeholder for Season 1 demonstration only.', 2);
