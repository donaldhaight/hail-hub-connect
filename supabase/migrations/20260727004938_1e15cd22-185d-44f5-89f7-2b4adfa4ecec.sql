
-- ============ dossiers ============
CREATE TABLE public.dossiers (
  slug TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  story_order INT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  confidentiality TEXT NOT NULL,
  truth_default TEXT NOT NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.dossiers TO authenticated;
GRANT ALL ON public.dossiers TO service_role;
ALTER TABLE public.dossiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insiders_read_dossiers" ON public.dossiers
  FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'qualified_insider')
    OR public.has_role(auth.uid(), 'founder_admin')
  );
CREATE POLICY "founder_write_dossiers" ON public.dossiers
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'founder_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'founder_admin'));

CREATE TRIGGER trg_dossiers_updated_at
  BEFORE UPDATE ON public.dossiers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ dossier_sections ============
CREATE TABLE public.dossier_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dossier_slug TEXT NOT NULL REFERENCES public.dossiers(slug) ON DELETE CASCADE,
  position INT NOT NULL,
  heading TEXT NOT NULL,
  truth TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (dossier_slug, position) DEFERRABLE INITIALLY DEFERRED
);
CREATE INDEX idx_dossier_sections_slug ON public.dossier_sections(dossier_slug, position);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.dossier_sections TO authenticated;
GRANT ALL ON public.dossier_sections TO service_role;
ALTER TABLE public.dossier_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insiders_read_sections" ON public.dossier_sections
  FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'qualified_insider')
    OR public.has_role(auth.uid(), 'founder_admin')
  );
CREATE POLICY "founder_write_sections" ON public.dossier_sections
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'founder_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'founder_admin'));

CREATE TRIGGER trg_dossier_sections_updated_at
  BEFORE UPDATE ON public.dossier_sections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ dossier_edits ============
CREATE TABLE public.dossier_edits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID NOT NULL,
  dossier_slug TEXT NOT NULL,
  section_id UUID,
  field TEXT NOT NULL,
  before_value TEXT,
  after_value TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_dossier_edits_created ON public.dossier_edits(created_at DESC);
GRANT SELECT, INSERT ON public.dossier_edits TO authenticated;
GRANT ALL ON public.dossier_edits TO service_role;
ALTER TABLE public.dossier_edits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "founder_read_edits" ON public.dossier_edits
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'founder_admin'));
CREATE POLICY "founder_insert_edits" ON public.dossier_edits
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'founder_admin') AND actor_id = auth.uid());

-- ============ Seed ============
INSERT INTO public.dossiers (slug, code, story_order, title, summary, confidentiality, truth_default) VALUES
('rrca-case-study', '01', 1,
 'RRCA Restructuring — Case Study',
 'The working case study for restructuring the Roofing & Reconstruction Contractors of America into the operational proof of the ClaimStore thesis.',
 'C3', 'HYPOTHESIS'),
('claimexpress', '02', 2,
 'ClaimExpress — Operational Layer',
 'The transaction rails: how a claim moves from event → sales → dispatch → project → completion → capital, standardized across restoration.',
 'C2', 'SIMULATION'),
('claimstore', '03', 3,
 'ClaimStore — Network Thesis',
 'The Barry-Diller-style rollup of the fragmented insurance-restoration market into a single, standardized, permissioned network.',
 'C2', 'ASSERTION'),
('usa-foundry', '04', 4,
 'USA Foundry — ClaimsBank · ClaimLoan · ClaimCoin',
 'The capital layer of United Stakeholders of America: standardized ledgers, contractor financing, and the tokenized settlement unit.',
 'C3', 'HYPOTHESIS'),
('prepare-america', '05', 5,
 'PrepareAmerica Conference — Agenda & Attendees',
 'The private convening on 11-01-2026. Draft agenda, invited categories, and the presentation order of the working artifacts.',
 'C2', 'DECISION');

INSERT INTO public.dossier_sections (dossier_slug, position, heading, truth, body) VALUES
('rrca-case-study', 1, 'Why RRCA is the proof of concept', 'ASSERTION',
E'RRCA is a real, national trade association inside the insurance-restoration market — the exact fragmented category the ClaimStore thesis is designed to consolidate. Restructuring it in the open, with insider observers, is how we test the model before we scale it.\n\nWe are not building a hypothetical. We are documenting a live restructuring, on the record, with truth labels attached to every claim.'),
('rrca-case-study', 2, 'Current state', 'SIMULATION',
'Working artifacts — org chart, member registers, standardized workflows, and audit surfaces — are being staged for founder review. Numbers shown in any early screen are simulated pending real-data ingest.'),
('rrca-case-study', 3, 'What insiders will see next', 'OPEN',
'The next release opens the restructuring workspace: registers, standardized project workflow, and the first audit exports. Insiders will be asked to redline both the artifact and the labeling discipline itself.'),

('claimexpress', 1, 'The pipeline', 'ASSERTION',
'Event → Lead → Qualified Claim → Contractor Dispatch → Project → Completion → Settlement → Capital Event. Every stage today is handled by a different fragmented actor with a different system of record. ClaimExpress standardizes the object and the handoff.'),
('claimexpress', 2, 'Simulated end-to-end flow', 'SIMULATION',
'Behind the paywall, the operational app renders a full simulated claim moving through the pipeline. This is the surface the PrepareAmerica attendees will see live. All parties, dollars, and timings are illustrative.'),

('claimstore', 1, 'The Diller pattern, applied', 'ASSERTION',
E'Diller''s playbook: identify a fragmented category with poor information flow, aggregate the supply side into a network, standardize the transaction, take a small toll on every unit. Insurance restoration is that category — a hail or hurricane event dispatches thousands of independent actors with no shared spine.\n\nClaimStore is that spine.'),
('claimstore', 2, 'Why now', 'HYPOTHESIS',
'Climate volatility increases event frequency. Carriers are consolidating and demand standardized settlement data. Contractors are cash-constrained and want capital access. The three sides of the market are, for the first time, motivated to accept a shared network.'),
('claimstore', 3, 'The toll', 'OPEN',
'Pricing, take rate, and settlement mechanics are open questions. Any figure surfaced in insider materials is a simulation for discussion, not an offer.'),

('usa-foundry', 1, 'Three instruments, one ledger', 'ASSERTION',
E'ClaimsBank standardizes settlement accounting. ClaimLoan finances the contractor''s working-capital gap between dispatch and settlement. ClaimCoin is the internal unit of account on the network — not an offering, not a security, structurally described only.'),
('usa-foundry', 2, 'Structural map only', 'OPEN',
'Every instrument here is described structurally for insider critique. Nothing in this dossier constitutes an offer to sell or a solicitation to buy any security, token, note, or interest.'),

('prepare-america', 1, 'The convening', 'DECISION',
'Sunday, November 1, 2026 · Gratitude Ranch, Flower Mound, TX · 300 invited principals. Private, non-transferable invitations. Presentation order follows the dossier index above.'),
('prepare-america', 2, 'Attendee categories', 'ASSERTION',
'C-level insurance and restoration operators. Institutional and family-office capital. Contractors with balance sheet. Government and think-tank observers. Legal and regulatory counsel.'),
('prepare-america', 3, 'Open logistics', 'OPEN',
'Room block, transportation, and confidentiality protocol for the day are being finalized. Insiders will receive logistics separately from this dossier surface.');
