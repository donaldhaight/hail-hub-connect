
-- 1) Funnel assumptions (low / base / high bands)
CREATE TABLE public.economics_assumptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  stage text NOT NULL,
  label text NOT NULL,
  definition text NOT NULL DEFAULT '',
  unit text NOT NULL DEFAULT 'rate',
  low numeric NOT NULL DEFAULT 0,
  base numeric NOT NULL DEFAULT 0,
  high numeric NOT NULL DEFAULT 0,
  truth_label text NOT NULL DEFAULT 'ASSERTION',
  source text NOT NULL DEFAULT '',
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.economics_assumptions TO authenticated;
GRANT ALL ON public.economics_assumptions TO service_role;
ALTER TABLE public.economics_assumptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY economics_assumptions_read ON public.economics_assumptions FOR SELECT TO authenticated USING (true);
CREATE POLICY economics_assumptions_founder ON public.economics_assumptions FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'founder_admin')) WITH CHECK (has_role(auth.uid(), 'founder_admin'));
CREATE TRIGGER economics_assumptions_updated BEFORE UPDATE ON public.economics_assumptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2) Build-out cost lines for the program bid
CREATE TABLE public.program_costs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  label text NOT NULL,
  note text NOT NULL DEFAULT '',
  est_amount numeric NOT NULL DEFAULT 0,
  act_amount numeric NOT NULL DEFAULT 0,
  recurring boolean NOT NULL DEFAULT false,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.program_costs TO authenticated;
GRANT ALL ON public.program_costs TO service_role;
ALTER TABLE public.program_costs ENABLE ROW LEVEL SECURITY;
CREATE POLICY program_costs_read ON public.program_costs FOR SELECT TO authenticated USING (true);
CREATE POLICY program_costs_founder ON public.program_costs FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'founder_admin')) WITH CHECK (has_role(auth.uid(), 'founder_admin'));
CREATE TRIGGER program_costs_updated BEFORE UPDATE ON public.program_costs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3) Public political coverage, county grain
CREATE TABLE public.canvass_coverage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  state text NOT NULL,
  county text NOT NULL,
  precincts integer NOT NULL DEFAULT 0,
  cycles_covered integer NOT NULL DEFAULT 0,
  earliest_cycle integer NOT NULL DEFAULT 2000,
  latest_cycle integer NOT NULL DEFAULT 2024,
  records bigint NOT NULL DEFAULT 0,
  registered_voters bigint NOT NULL DEFAULT 0,
  turnout_rate numeric NOT NULL DEFAULT 0,
  households bigint NOT NULL DEFAULT 0,
  source text NOT NULL DEFAULT 'Public election records',
  truth_label text NOT NULL DEFAULT 'FACT',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (state, county)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.canvass_coverage TO authenticated;
GRANT ALL ON public.canvass_coverage TO service_role;
ALTER TABLE public.canvass_coverage ENABLE ROW LEVEL SECURITY;
CREATE POLICY canvass_coverage_read ON public.canvass_coverage FOR SELECT TO authenticated USING (true);
CREATE POLICY canvass_coverage_founder ON public.canvass_coverage FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'founder_admin')) WITH CHECK (has_role(auth.uid(), 'founder_admin'));
CREATE TRIGGER canvass_coverage_updated BEFORE UPDATE ON public.canvass_coverage
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4) Mission tracks
CREATE TABLE public.mission_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  kind text NOT NULL,
  purpose text NOT NULL DEFAULT '',
  note text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'active',
  truth_label text NOT NULL DEFAULT 'DECISION',
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mission_tracks TO authenticated;
GRANT ALL ON public.mission_tracks TO service_role;
ALTER TABLE public.mission_tracks ENABLE ROW LEVEL SECURITY;
CREATE POLICY mission_tracks_read ON public.mission_tracks FOR SELECT TO authenticated USING (true);
CREATE POLICY mission_tracks_founder ON public.mission_tracks FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'founder_admin')) WITH CHECK (has_role(auth.uid(), 'founder_admin'));
CREATE TRIGGER mission_tracks_updated BEFORE UPDATE ON public.mission_tracks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed: funnel assumptions
INSERT INTO public.economics_assumptions (key, stage, label, definition, unit, low, base, high, truth_label, source, position) VALUES
 ('impact_rate','footprint','Impact rate','Properties inside the swath that become a filed claim.','rate',0.08,0.14,0.22,'ASSERTION','Founder field record, 20 seasons',10),
 ('addressable_rate','targeting','Addressable rate','Impacted properties we can actually reach with a campaign.','rate',0.55,0.70,0.85,'ASSERTION','Founder field record',20),
 ('cpm','campaign','Cost per thousand impressions','Blended paid media cost per 1,000 impressions in a storm market.','usd',9,14,22,'ASSERTION','Ad platform history',30),
 ('impressions_per_survey','campaign','Impressions per completed survey','Paid impressions required for one completed silent survey.','count',900,1400,2200,'ASSERTION','Campaign history',40),
 ('doors_per_hour','campaign','Doors per canvasser hour','Doors touched per canvasser hour in a worked neighborhood.','count',12,16,22,'ASSERTION','Crew timesheets',50),
 ('doors_per_survey','campaign','Doors per completed survey','Doors touched for one completed survey at the door.','count',18,26,40,'ASSERTION','Crew timesheets',60),
 ('canvasser_hour_cost','campaign','Canvasser cost per hour','Fully loaded cost of one door-to-door hour.','usd',22,28,36,'ASSERTION','Payroll record',70),
 ('survey_to_lead','conversion','Survey to lead','Completed surveys that become an originated lead.','rate',0.06,0.11,0.18,'ASSERTION','Founder field record',80),
 ('lead_to_job','conversion','Lead to contracted job','Originated leads that close to a signed job.','rate',0.14,0.22,0.33,'ASSERTION','Founder field record',90),
 ('job_average','revenue','Job average','Average contracted job value, residential steep-slope.','usd',11000,16500,24000,'ASSERTION','Job history',100),
 ('attach_selfinsurity','synergy','SelfInsurity attach','Closed jobs that attach a SelfInsurity product.','rate',0.05,0.12,0.20,'HYPOTHESIS','Modeled',110),
 ('attach_buddyclaim','synergy','BuddyClaim attach','Closed jobs that attach a BuddyClaim engagement.','rate',0.08,0.15,0.25,'HYPOTHESIS','Modeled',120),
 ('attach_claimstore','synergy','ClaimStore attach','Closed jobs settled through ClaimStore rails.','rate',0.10,0.20,0.35,'HYPOTHESIS','Modeled',130),
 ('synergy_value_per_attach','synergy','Synergy value per attach','Average network revenue per attached product.','usd',350,700,1400,'HYPOTHESIS','Modeled',140),
 ('captain_multiplier','wildcard','Neighborhood Captain multiplier','Lift on originated leads where a Neighborhood Captain is seated. Upside only; excluded from the base case.','multiplier',1.15,1.60,2.40,'HYPOTHESIS','Founder estimate',150);

-- Seed: build-out cost lines
INSERT INTO public.program_costs (category, label, note, est_amount, recurring, position) VALUES
 ('Build','Seven stakeholder front doors','Foundation, Tech, Legal, Insurance, Banking, Construction, Center.',84000,false,10),
 ('Build','Situation Room console','Lenses, variable registry, signals, provenance click-through.',96000,false,20),
 ('Build','Lead origination and distribution rails','Capture, dedupe, route, offer, follow-up.',120000,false,30),
 ('Build','Delegate and seat systems','Invitations, credentials, itinerary, broadcast.',38000,false,40),
 ('Build','Owner''s Manual and evidence layer','Corpus, intake lane, attachments, glossary.',42000,false,50),
 ('Infrastructure','Hosting, data, and observability','Annualized platform and data cost.',36000,true,60),
 ('Labor','Human hours','Founder and specialist hours at loaded rate.',180000,false,70),
 ('Labor','Agent hours','Agent build and maintenance hours at metered cost.',26000,false,80),
 ('Equipment','Field and event equipment','Canvass kit, event production, capture devices.',28000,false,90),
 ('Other','Contingency','Held against the 10% variance commitment.',45000,false,100);

-- Seed: political coverage for the two scenario footprints
INSERT INTO public.canvass_coverage (state, county, precincts, cycles_covered, earliest_cycle, latest_cycle, records, registered_voters, turnout_rate, households) VALUES
 ('TX','Harris',1071,13,2000,2024,41200000,2560000,0.61,1720000),
 ('TX','Fort Bend',236,13,2000,2024,7400000,520000,0.68,290000),
 ('TX','Galveston',126,13,2000,2024,3100000,235000,0.63,140000),
 ('TX','Brazoria',119,13,2000,2024,2900000,255000,0.64,138000),
 ('TX','Montgomery',192,13,2000,2024,4300000,410000,0.66,225000),
 ('TX','Matagorda',31,13,2000,2024,540000,23000,0.55,15000),
 ('TX','Wharton',28,13,2000,2024,480000,25000,0.56,16000),
 ('TX','Jackson',14,13,2000,2024,260000,10500,0.58,6200),
 ('TX','Dallas',794,13,2000,2024,33800000,1420000,0.58,960000),
 ('TX','Tarrant',697,13,2000,2024,28900000,1290000,0.62,760000),
 ('TX','Collin',255,13,2000,2024,9800000,680000,0.69,390000),
 ('TX','Denton',290,13,2000,2024,8600000,610000,0.67,350000),
 ('TX','Rockwall',33,13,2000,2024,900000,74000,0.71,38000),
 ('TX','Ellis',48,13,2000,2024,1400000,120000,0.63,68000),
 ('TX','Johnson',46,13,2000,2024,1300000,115000,0.62,64000),
 ('TX','Parker',40,13,2000,2024,1200000,105000,0.66,55000);

-- Seed: mission tracks
INSERT INTO public.mission_tracks (slug, name, kind, purpose, note, truth_label, position) VALUES
 ('weather','The Weather Track','weather','Turn a storm footprint into originated leads, closed jobs, and network revenue.','Twenty seasons of field record. Runs on the low band on stage, deliberately.','ASSERTION',10),
 ('politics','The Canvass Track','political','Show the coverage of public political records at the same county grain as the storm data.','Method described, conclusion never stated. Records only.','FACT',20),
 ('cultural-races','The Cultural Races','cultural','Seasonal competitive surface that gives the room heat and motion.','Real rows, real counters. Holds up to a delegate who pokes at it.','DECISION',30),
 ('canon','The Canon','cultural','The written record: Owner''s Manual, saga, dossiers.','Growth measured in words and evidence attached.','FACT',40),
 ('seasons','The Season Ladder','cultural','Season 1 through 3 seat rights and the Two Congress calendar.','Seat licenses, delegate ladder, congress dates.','DECISION',50);

-- Standing operations items in the backlog
INSERT INTO public.backlog_items (category, title, summary, detail, status, priority, position) VALUES
 ('Operations','Rename GitHub repo to prepareamerica','Founder action. Rename the repo, update the Git sync URL, then agent re-verifies the mirror.',
  E'1. GitHub: donaldhaight/hail-hub-connect -> Settings -> General -> rename to prepareamerica.\n2. Lovable: Settings -> Git -> update URL to https://github.com/donaldhaight/prepareamerica.git and sync.\n3. Agent: verify the mirror includes src/, docs/, supabase/, and migrations.','planned',1,10),
 ('Operations','Point prepareamerica.com at the published site','Founder action on DNS. Agent verifies canonical URL and sitemap afterward.',
  E'1. Project Settings -> Domains -> add prepareamerica.com.\n2. Add the DNS records shown at the registrar.\n3. Wait for SSL to issue.\n4. Agent: confirm canonical URL, sitemap, and metadata resolve to the custom domain.','planned',1,20),
 ('Operations','Standing ship check after every sprint','Agent action. Confirm the published build is current and the repo mirror is fresh.',
  E'Run at the close of each sprint: production build passes, frontend published, Git mirror current, docs/SPRINTS.md updated.','planned',2,30);
