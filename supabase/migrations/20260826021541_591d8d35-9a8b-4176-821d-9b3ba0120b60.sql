
-- ============ SCENARIOS ============
CREATE TABLE public.room_scenarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  peril text NOT NULL,
  event_date date NOT NULL,
  region text NOT NULL,
  note text NOT NULL DEFAULT '',
  is_production boolean NOT NULL DEFAULT false,
  clock_steps integer NOT NULL DEFAULT 4,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.room_scenarios TO authenticated;
GRANT ALL ON public.room_scenarios TO service_role;
ALTER TABLE public.room_scenarios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "room_scenarios_read" ON public.room_scenarios FOR SELECT TO authenticated USING (true);
CREATE POLICY "room_scenarios_founder" ON public.room_scenarios FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'founder_admin')) WITH CHECK (public.has_role(auth.uid(), 'founder_admin'));
CREATE TRIGGER room_scenarios_updated_at BEFORE UPDATE ON public.room_scenarios
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ VARIABLE REGISTRY ============
CREATE TABLE public.room_variables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  name text NOT NULL,
  definition text NOT NULL DEFAULT '',
  unit text NOT NULL DEFAULT 'count',
  source text NOT NULL DEFAULT '',
  cadence text NOT NULL DEFAULT 'daily',
  stakeholder text NOT NULL,
  truth_label text NOT NULL DEFAULT 'ASSERTION',
  confidentiality text NOT NULL DEFAULT 'C2',
  headline boolean NOT NULL DEFAULT false,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.room_variables TO authenticated;
GRANT ALL ON public.room_variables TO service_role;
ALTER TABLE public.room_variables ENABLE ROW LEVEL SECURITY;
CREATE POLICY "room_variables_read" ON public.room_variables FOR SELECT TO authenticated USING (true);
CREATE POLICY "room_variables_founder" ON public.room_variables FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'founder_admin')) WITH CHECK (public.has_role(auth.uid(), 'founder_admin'));
CREATE TRIGGER room_variables_updated_at BEFORE UPDATE ON public.room_variables
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ SIGNALS ============
CREATE TABLE public.room_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id uuid NOT NULL REFERENCES public.room_scenarios(id) ON DELETE CASCADE,
  variable_key text NOT NULL REFERENCES public.room_variables(key) ON DELETE CASCADE,
  state text NOT NULL,
  county text NOT NULL,
  clock_step integer NOT NULL DEFAULT 0,
  observed_at timestamptz NOT NULL DEFAULT now(),
  value numeric NOT NULL DEFAULT 0,
  confidence numeric NOT NULL DEFAULT 0.5,
  provenance text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX room_signals_lookup ON public.room_signals (scenario_id, clock_step, variable_key);
GRANT SELECT ON public.room_signals TO authenticated;
GRANT ALL ON public.room_signals TO service_role;
ALTER TABLE public.room_signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "room_signals_read" ON public.room_signals FOR SELECT TO authenticated USING (true);
CREATE POLICY "room_signals_founder" ON public.room_signals FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'founder_admin')) WITH CHECK (public.has_role(auth.uid(), 'founder_admin'));

-- ============ SAVED VIEWS ============
CREATE TABLE public.room_saved_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  lens text NOT NULL DEFAULT 'Center',
  layout text NOT NULL DEFAULT 'table',
  query jsonb NOT NULL DEFAULT '{}'::jsonb,
  shared boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.room_saved_views TO authenticated;
GRANT ALL ON public.room_saved_views TO service_role;
ALTER TABLE public.room_saved_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "room_saved_views_read" ON public.room_saved_views FOR SELECT TO authenticated
  USING (shared OR owner_id = auth.uid());
CREATE POLICY "room_saved_views_own" ON public.room_saved_views FOR ALL TO authenticated
  USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());
CREATE TRIGGER room_saved_views_updated_at BEFORE UPDATE ON public.room_saved_views
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ TASK LEDGER ============
CREATE TABLE public.task_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  task_class text NOT NULL DEFAULT 'build',
  actor text NOT NULL DEFAULT 'agent',
  sprint_label text,
  occurred_on date NOT NULL DEFAULT current_date,
  est_hours numeric NOT NULL DEFAULT 0,
  act_hours numeric NOT NULL DEFAULT 0,
  est_cost numeric NOT NULL DEFAULT 0,
  act_cost numeric NOT NULL DEFAULT 0,
  rework integer NOT NULL DEFAULT 0,
  outcome text NOT NULL DEFAULT 'open',
  note text NOT NULL DEFAULT '',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.task_ledger TO authenticated;
GRANT ALL ON public.task_ledger TO service_role;
ALTER TABLE public.task_ledger ENABLE ROW LEVEL SECURITY;
CREATE POLICY "task_ledger_founder" ON public.task_ledger FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'founder_admin')) WITH CHECK (public.has_role(auth.uid(), 'founder_admin'));
CREATE TRIGGER task_ledger_updated_at BEFORE UPDATE ON public.task_ledger
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ SEED: VARIABLES ============
INSERT INTO public.room_variables (key, name, definition, unit, source, cadence, stakeholder, truth_label, confidentiality, headline, position) VALUES
('counties_touched','Counties Touched','Counties inside the event footprint with at least one confirmed impact report.','count','NOAA storm reports + field confirmation','hourly','Foundation','FACT','C1',true,1),
('roofs_impacted','Roofs Impacted','Modeled count of residential roofs inside the damage swath.','count','Impact model over parcel data','hourly','Construction','ASSERTION','C2',true,2),
('claims_in_flight','Claims In Flight','Open claims filed against the event and not yet closed.','count','Carrier feed + intake desk','hourly','Insurance','ASSERTION','C2',true,3),
('dollars_staged','Dollars Staged','Capital committed but not yet released against work in the footprint.','usd','Settlement ledger','hourly','Banking','ASSERTION','C3',true,4),
('crews_available','Crews Available','Verified crews with capacity inside a two-hour drive of the footprint.','count','Crew registry check-in','hourly','Construction','ASSERTION','C2',true,5),
('disputes_open','Disputes Open','Claims in dispute, denial, or supplement contest.','count','Resolution desk','daily','Legal','ASSERTION','C2',true,6),
('feeds_online','Feeds Online','Data feeds reporting inside their expected cadence.','count','Platform health check','minute','Tech','FACT','C1',true,7),
('delegates_committed','Delegates Committed','Stakeholders with a confirmed seat obligation in the affected region.','count','Delegate registry','daily','Foundation','FACT','C2',false,8),
('coordination_index','Coordination Index','Composite of matched capacity to demand across all six functions.','index','Computed from the six function variables','hourly','Center','ASSERTION','C3',true,9);

-- ============ SEED: SCENARIOS ============
INSERT INTO public.room_scenarios (slug, name, peril, event_date, region, note, is_production, clock_steps, position) VALUES
('beryl-2024','Hurricane Beryl','Hurricane','2024-07-08','Texas Gulf Coast','Landfall near Matagorda, 08 July 2024. Footprint counties are real; every value on this scenario is modeled for demonstration.', false, 4, 1),
('north-texas-hail-2024','North Texas Hail','Hail','2024-05-28','Dallas–Fort Worth','Late-May supercell line across the Metroplex. Footprint counties are real; every value on this scenario is modeled for demonstration.', false, 4, 2);

-- ============ SEED: SIGNALS ============
INSERT INTO public.room_signals (scenario_id, variable_key, state, county, clock_step, observed_at, value, confidence, provenance)
SELECT s.id,
       v.key,
       c.state,
       c.county,
       step,
       s.event_date::timestamptz + (step || ' hours')::interval,
       round((c.weight * v.scale * (0.35 + step * 0.24))::numeric, 2),
       least(0.99, 0.42 + step * 0.14 + c.weight / 40.0),
       'Scenario replay — ' || s.name || ' step ' || step || '. Modeled from ' || v.src
FROM public.room_scenarios s
CROSS JOIN LATERAL (
  SELECT * FROM (VALUES
    ('beryl-2024','TX','Harris',9.0),('beryl-2024','TX','Matagorda',6.5),('beryl-2024','TX','Brazoria',7.2),
    ('beryl-2024','TX','Galveston',6.1),('beryl-2024','TX','Fort Bend',5.4),('beryl-2024','TX','Montgomery',4.8),
    ('beryl-2024','TX','Wharton',3.6),('beryl-2024','TX','Jackson',2.9),
    ('north-texas-hail-2024','TX','Tarrant',8.4),('north-texas-hail-2024','TX','Dallas',8.9),
    ('north-texas-hail-2024','TX','Denton',6.8),('north-texas-hail-2024','TX','Collin',6.2),
    ('north-texas-hail-2024','TX','Rockwall',3.1),('north-texas-hail-2024','TX','Ellis',3.9),
    ('north-texas-hail-2024','TX','Johnson',3.4),('north-texas-hail-2024','TX','Parker',2.8)
  ) AS t(scen, state, county, weight)
  WHERE t.scen = s.slug
) c
CROSS JOIN LATERAL (
  SELECT * FROM (VALUES
    ('counties_touched', 0.11, 'NOAA storm reports'),
    ('roofs_impacted', 640.0, 'the parcel impact model'),
    ('claims_in_flight', 210.0, 'the carrier feed'),
    ('dollars_staged', 148000.0, 'the settlement ledger'),
    ('crews_available', 3.4, 'crew registry check-in'),
    ('disputes_open', 12.0, 'the resolution desk'),
    ('feeds_online', 0.9, 'platform health checks'),
    ('delegates_committed', 1.2, 'the delegate registry'),
    ('coordination_index', 7.5, 'the six function variables')
  ) AS t(key, scale, src)
) v
CROSS JOIN generate_series(0, 3) AS step;

-- ============ SEED: TASK LEDGER ============
INSERT INTO public.task_ledger (title, task_class, actor, sprint_label, occurred_on, est_hours, act_hours, est_cost, act_cost, rework, outcome, note) VALUES
('Public front door — routes, tokens, copy','build','agent','Sprint 0.1','2026-08-20',18,16.5,1800,1650,1,'accepted','Phase 0 shell.'),
('Founder inbox and triage workflow','build','agent','Sprint 0.4','2026-08-21',14,15.2,1400,1520,2,'accepted','Estimate missed by one rework cycle.'),
('Strategy session — Two Congress structure','strategy','human',NULL,'2026-08-25',6,7.5,900,1125,0,'accepted','Founder hours, loaded rate.'),
('Owner''s Manual infrastructure','build','agent','Sprint 3.2','2026-08-25',12,11.0,1200,1100,0,'accepted','Under estimate.'),
('Intake Lane and Concept Lab','build','agent','Sprint 3.2c','2026-08-25',16,17.4,1600,1740,1,'accepted','Search added mid-sprint.'),
('Corpus read — HBOS v0.2 bundle','research','agent',NULL,'2026-08-26',5,4.2,500,420,0,'accepted','34 documents.'),
('Act 1 chapters — draft','writing','human',NULL,'2026-08-26',9,10.5,1350,1575,1,'accepted','Founder narration plus revision.'),
('Situation Room — Phase A','build','agent','Act 2.1','2026-08-26',20,0,2000,0,0,'open','Estimate standing; actuals open.');
