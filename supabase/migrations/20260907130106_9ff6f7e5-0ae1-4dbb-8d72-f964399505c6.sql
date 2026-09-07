ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'verified_member';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'lc';

INSERT INTO public.role_catalog (key, name, axis, summary, detail, requestable, certifiable, fee_jbk, is_active, position)
VALUES (
  'lc',
  'Licensed Contractor (LC)',
  'entity',
  'The operator who delivers the work a Sales Rep sold.',
  'LC is the second half of the transaction. Same certification machine as ISR — a fee, a curriculum, a quiz per module — plus a verification step ISR does not need: license, insurance, and tax identity. Listed here so the shape exists before the curriculum does.',
  false,
  true,
  500,
  false,
  110
)
ON CONFLICT (key) DO NOTHING;

CREATE OR REPLACE FUNCTION public.redeem_insider_invitation(_token uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  inv public.insider_invitations%ROWTYPE;
  user_email text;
  uid uuid := auth.uid();
  granted text;
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

  -- Rung 2: every accepted person stands here, whatever group they belong to.
  INSERT INTO public.user_roles (user_id, role)
  VALUES (uid, 'verified_member')
  ON CONFLICT (user_id, role) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (uid, 'qualified_insider')
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Apply the Stakeholder Group the founder assigned on acceptance.
  IF inv.briefing_request_id IS NOT NULL THEN
    SELECT br.granted_role INTO granted
      FROM public.briefing_requests br
     WHERE br.id = inv.briefing_request_id;

    IF granted IS NOT NULL
       AND EXISTS (SELECT 1 FROM public.role_catalog rc WHERE rc.key = granted)
       AND granted = ANY (enum_range(NULL::public.app_role)::text[]) THEN
      EXECUTE 'INSERT INTO public.user_roles (user_id, role) VALUES ($1, $2::public.app_role) ON CONFLICT (user_id, role) DO NOTHING'
        USING uid, granted;
    END IF;
  END IF;

  UPDATE public.insider_invitations
     SET status = 'redeemed',
         redeemed_at = now(),
         redeemed_by = uid
   WHERE id = inv.id;

  RETURN jsonb_build_object('ok', true, 'grantedRole', granted);
END;
$function$;