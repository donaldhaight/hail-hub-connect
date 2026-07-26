
-- 1) Add new role
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'qualified_insider';

-- 2) Invitations table
CREATE TABLE IF NOT EXISTS public.insider_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  briefing_request_id uuid REFERENCES public.briefing_requests(id) ON DELETE SET NULL,
  email text NOT NULL,
  token uuid NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  status text NOT NULL DEFAULT 'pending',
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  redeemed_at timestamptz,
  redeemed_by uuid,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_insider_invitations_email ON public.insider_invitations (email);
CREATE INDEX IF NOT EXISTS idx_insider_invitations_briefing ON public.insider_invitations (briefing_request_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.insider_invitations TO authenticated;
GRANT ALL ON public.insider_invitations TO service_role;

ALTER TABLE public.insider_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Founder admins manage invitations"
  ON public.insider_invitations FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'founder_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'founder_admin'));

CREATE TRIGGER insider_invitations_updated_at
  BEFORE UPDATE ON public.insider_invitations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3) Redemption function (SECURITY DEFINER; anon-callable would be pointless since we need auth.uid())
CREATE OR REPLACE FUNCTION public.redeem_insider_invitation(_token uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  inv public.insider_invitations%ROWTYPE;
  user_email text;
  uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_signed_in');
  END IF;

  SELECT email INTO user_email FROM auth.users WHERE id = uid;

  SELECT * INTO inv FROM public.insider_invitations WHERE token = _token;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid_token');
  END IF;

  IF inv.status = 'revoked' THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'revoked');
  END IF;

  IF inv.redeemed_at IS NOT NULL THEN
    IF inv.redeemed_by = uid THEN
      RETURN jsonb_build_object('ok', true, 'already', true);
    END IF;
    RETURN jsonb_build_object('ok', false, 'reason', 'already_redeemed');
  END IF;

  IF inv.expires_at < now() THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'expired');
  END IF;

  IF lower(user_email) <> lower(inv.email) THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'email_mismatch', 'expected', inv.email);
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (uid, 'qualified_insider')
  ON CONFLICT (user_id, role) DO NOTHING;

  UPDATE public.insider_invitations
     SET status = 'redeemed',
         redeemed_at = now(),
         redeemed_by = uid
   WHERE id = inv.id;

  RETURN jsonb_build_object('ok', true);
END;
$$;

REVOKE ALL ON FUNCTION public.redeem_insider_invitation(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.redeem_insider_invitation(uuid) TO authenticated;
