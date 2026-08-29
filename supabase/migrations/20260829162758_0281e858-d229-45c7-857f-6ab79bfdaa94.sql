-- 1. New role tags
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'interested_user';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'industry_observer';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'venture_tech';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'systems_tech';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'legal_tech';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'insure_tech';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'fin_tech';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'construction_management';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'business_development';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'isr';

-- 2. Request Access carries the chosen role and the anonymous file
ALTER TABLE public.briefing_requests
  ADD COLUMN IF NOT EXISTS requested_role text,
  ADD COLUMN IF NOT EXISTS anchor uuid,
  ADD COLUMN IF NOT EXISTS granted_role text,
  ADD COLUMN IF NOT EXISTS granted_at timestamptz,
  ADD COLUMN IF NOT EXISTS granted_by uuid;

-- 3. Role catalog
CREATE TABLE public.role_catalog (
  key text PRIMARY KEY,
  name text NOT NULL,
  axis text NOT NULL DEFAULT 'stakeholder',
  summary text NOT NULL DEFAULT '',
  detail text NOT NULL DEFAULT '',
  requestable boolean NOT NULL DEFAULT true,
  certifiable boolean NOT NULL DEFAULT false,
  fee_jbk numeric NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.role_catalog TO anon;
GRANT SELECT ON public.role_catalog TO authenticated;
GRANT ALL ON public.role_catalog TO service_role;
ALTER TABLE public.role_catalog ENABLE ROW LEVEL SECURITY;
CREATE POLICY "role_catalog readable" ON public.role_catalog FOR SELECT USING (true);
CREATE POLICY "role_catalog founder writes" ON public.role_catalog FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'founder_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'founder_admin'));
CREATE TRIGGER role_catalog_updated_at BEFORE UPDATE ON public.role_catalog
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Certification modules (video + quiz as data)
CREATE TABLE public.role_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_key text NOT NULL REFERENCES public.role_catalog(key) ON DELETE CASCADE,
  position integer NOT NULL,
  title text NOT NULL,
  summary text NOT NULL DEFAULT '',
  video_url text,
  body text NOT NULL DEFAULT '',
  quiz_question text NOT NULL,
  quiz_options text[] NOT NULL DEFAULT '{}',
  quiz_answer integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (role_key, position)
);
GRANT SELECT ON public.role_modules TO anon;
GRANT SELECT ON public.role_modules TO authenticated;
GRANT ALL ON public.role_modules TO service_role;
ALTER TABLE public.role_modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "role_modules readable" ON public.role_modules FOR SELECT USING (true);
CREATE POLICY "role_modules founder writes" ON public.role_modules FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'founder_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'founder_admin'));
CREATE TRIGGER role_modules_updated_at BEFORE UPDATE ON public.role_modules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Enrollment in a certifiable role
CREATE TABLE public.role_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_key text NOT NULL REFERENCES public.role_catalog(key) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'enrolled',
  fee_paid_at timestamptz,
  fee_amount numeric NOT NULL DEFAULT 0,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role_key)
);
GRANT SELECT ON public.role_enrollments TO authenticated;
GRANT ALL ON public.role_enrollments TO service_role;
ALTER TABLE public.role_enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "role_enrollments read own" ON public.role_enrollments FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'founder_admin'));
CREATE TRIGGER role_enrollments_updated_at BEFORE UPDATE ON public.role_enrollments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Module-by-module progress
CREATE TABLE public.role_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_key text NOT NULL,
  module_id uuid NOT NULL REFERENCES public.role_modules(id) ON DELETE CASCADE,
  passed_at timestamptz NOT NULL DEFAULT now(),
  attempts integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, module_id)
);
GRANT SELECT ON public.role_progress TO authenticated;
GRANT ALL ON public.role_progress TO service_role;
ALTER TABLE public.role_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "role_progress read own" ON public.role_progress FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'founder_admin'));
CREATE TRIGGER role_progress_updated_at BEFORE UPDATE ON public.role_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 7. Seed the catalog
INSERT INTO public.role_catalog (key, name, axis, summary, detail, requestable, certifiable, fee_jbk, position) VALUES
  ('interested_user','Interested User','stakeholder','Provisioned on arrival. No certification, no verification.','A device anchor, a holding wallet, and a file that sharpens as you move. The only role nobody requests — it is given at the door.',false,false,0,0),
  ('industry_observer','Industry Observer','stakeholder','Watching the mission without standing in it.','Read access to the public record and the open ledger feed. A tag more than a seat.',true,false,0,10),
  ('venture_tech','VentureTech','stakeholder','Capital formation and portfolio construction.','Investors, venture partners, and the people who price the whole.',true,false,0,20),
  ('systems_tech','SystemsTech','stakeholder','The platform, the agents, and the stacks beneath them.','Architecture, orchestration, and the machinery that carries the mission.',true,false,0,30),
  ('legal_tech','LegalTech','stakeholder','Counsel, contracts, and the rules of the road.','Construction, restructuring, securities, and the claim itself.',true,false,0,40),
  ('insure_tech','InsureTech','stakeholder','Carriers, adjusters, and the risk transfer layer.','Where the claim begins and where the market keeps failing.',true,false,0,50),
  ('fin_tech','FinTech','stakeholder','Ledgers, tokens, settlement, and the money spine.','JBK, ClaimCoin, and the accounting that makes both auditable.',true,false,0,60),
  ('construction_management','Construction Management','stakeholder','Contractors, crews, and the work that gets done.','The RRCA loop and the season that pays for everything.',true,false,0,70),
  ('business_development','Business Development','stakeholder','Sponsors, partners, and the sales motion.','Seat rights, sponsorships, and the recruitment engine.',true,false,0,80),
  ('isr','Independent Sales Rep (ISR)','entity','The first certifiable operating role in the MarketApp.','Four modules, four quizzes, one fee. Completion writes the role and lands you on your App Home.',false,true,500,100)
ON CONFLICT (key) DO NOTHING;

-- 8. Seed the four ISR modules
INSERT INTO public.role_modules (role_key, position, title, summary, body, quiz_question, quiz_options, quiz_answer) VALUES
  ('isr',1,'The Market and the Claim','What an insurance restoration claim actually is, and why the transaction has never closed cleanly.','A claim is a promise under stress. The ISR stands between a property owner who has just lost something and a market that is not organized to help them quickly. Your first job is to understand the shape of that promise before you ever knock on a door.','What is the ISR standing between?',ARRAY['A carrier and a reinsurer','A property owner and a market that is not organized','Two contractors bidding the same roof','A lender and a borrower'],1),
  ('isr',2,'The Season','How a roofing season works, why every property certifies once a year, and what a Task is.','The season is the clock. Every property is certified once a year, storm or no storm. Tasks are generated against that clock, each with a need, an owner, and a state — open or closed. Nothing in the MarketApp exists without a Task behind it.','How often must every property be certified?',ARRAY['Only after a storm','Once every year','Once every three years','Only when the owner requests it'],1),
  ('isr',3,'The Ledger','Tokens, wallets, and why every movement is recorded and never edited.','The ledger is append-only. Balances are summed from entries, never stored and adjusted. When you earn, when you spend, when a wallet is claimed — each is a permanent line with a date, a reason, and a reference. This is what makes the mission auditable.','What makes the platform ledger trustworthy?',ARRAY['Balances are stored and updated carefully','Entries are append-only and balances are derived','An administrator reviews it monthly','It is backed by a bank'],1),
  ('isr',4,'The Standard','The quasi service level agreement you accept as an ISR, and what breaks it.','Standing is not a title, it is a standard. Response time, honest representation of scope, and never promising what the carrier has not agreed to. Break the standard and the role is withdrawn — the ledger remembers either way.','What happens when an ISR breaks the standard?',ARRAY['Nothing, it is advisory','The role is withdrawn and the record stands','A fine is deducted from ClaimCoin','The task is reassigned silently'],1)
ON CONFLICT (role_key, position) DO NOTHING;