CREATE TABLE public.screen_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  branch TEXT NOT NULL,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'empty',
  class TEXT NOT NULL DEFAULT 'C2',
  truth TEXT NOT NULL DEFAULT 'OPEN',
  route TEXT,
  pattern_links TEXT[] NOT NULL DEFAULT '{}',
  register_ids TEXT[] NOT NULL DEFAULT '{}',
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT screen_pages_unique UNIQUE (branch, slug),
  CONSTRAINT screen_pages_status_check CHECK (status IN ('empty','specified','built')),
  CONSTRAINT screen_pages_class_check CHECK (class IN ('C0','C1','C2','C3','C4')),
  CONSTRAINT screen_pages_truth_check CHECK (truth IN ('FACT','ASSERTION','DECISION','HYPOTHESIS','SIMULATION','OPEN'))
);

CREATE TABLE public.screen_facets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID NOT NULL REFERENCES public.screen_pages(id) ON DELETE CASCADE,
  facet_key TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT screen_facets_unique UNIQUE (page_id, facet_key),
  CONSTRAINT screen_facets_key_check CHECK (facet_key IN (
    'purpose','permissions','records','actions','tools','context','completion',
    'content','layout','components','states','persona','open_questions'
  ))
);

CREATE TABLE public.screen_facet_revisions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID NOT NULL REFERENCES public.screen_pages(id) ON DELETE CASCADE,
  facet_key TEXT NOT NULL,
  body TEXT NOT NULL,
  edited_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.screen_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID NOT NULL REFERENCES public.screen_pages(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  storage_path TEXT,
  external_url TEXT,
  title TEXT NOT NULL,
  description TEXT,
  original_date DATE,
  source_label TEXT,
  mime_type TEXT,
  size_bytes BIGINT,
  position INTEGER NOT NULL DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT screen_attachments_kind_check CHECK (kind IN ('file','link'))
);

CREATE INDEX screen_facets_page_idx ON public.screen_facets(page_id);
CREATE INDEX screen_facet_revisions_page_idx ON public.screen_facet_revisions(page_id, facet_key, created_at DESC);
CREATE INDEX screen_attachments_page_idx ON public.screen_attachments(page_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.screen_pages TO authenticated;
GRANT ALL ON public.screen_pages TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.screen_facets TO authenticated;
GRANT ALL ON public.screen_facets TO service_role;
GRANT SELECT, INSERT ON public.screen_facet_revisions TO authenticated;
GRANT ALL ON public.screen_facet_revisions TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.screen_attachments TO authenticated;
GRANT ALL ON public.screen_attachments TO service_role;

ALTER TABLE public.screen_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screen_facets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screen_facet_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screen_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Founder manages screen pages" ON public.screen_pages
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'founder_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'founder_admin'));

CREATE POLICY "Founder manages screen facets" ON public.screen_facets
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'founder_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'founder_admin'));

CREATE POLICY "Founder reads screen revisions" ON public.screen_facet_revisions
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'founder_admin'));

CREATE POLICY "Founder appends screen revisions" ON public.screen_facet_revisions
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'founder_admin'));

CREATE POLICY "Founder manages screen attachments" ON public.screen_attachments
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'founder_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'founder_admin'));

CREATE TRIGGER update_screen_pages_updated_at BEFORE UPDATE ON public.screen_pages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_screen_facets_updated_at BEFORE UPDATE ON public.screen_facets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_screen_attachments_updated_at BEFORE UPDATE ON public.screen_attachments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.screen_pages (branch, slug, name, position)
SELECT t.b, s.slug, replace(s.slug, '_', ' '), s.ord
FROM (VALUES
  ('01_Public_Website', ARRAY['Home','Thesis','Case_Study','Architecture','Roles','Congress','Founder','Investors','Policy','Request_Briefing','Sign_In']),
  ('02_Persona_Front_Doors', ARRAY['Kimosabe','Buddy_Claim','Future_Personas']),
  ('03_Interested_User', ARRAY['Arrival','Conversation','Anonymous_File','Wallet','Ledger','Memory','Return_Visit','Become_A_Member']),
  ('04_App_Home', ARRAY['Home_Page','Guide_Channel','Search','New','Tasks','Account','Role_Switcher','Role_Store']),
  ('05_ISR', ARRAY['Get_Set_Up','Day_01','Day_02','Day_03','Day_04','Day_05','Day_06','Day_07','Day_08','Day_09','Day_10','Certification','ISR_Home','Daily_Work']),
  ('06_LC', ARRAY['Get_Set_Up','Verification','Offer_Approval','Book_Of_Work','LC_Home']),
  ('07_Property_Owner', ARRAY['Property_Setup','Free_Quote','RoofLac_Offer','Good_Better_Best','PO_Home']),
  ('08_Construction_Manager', ARRAY['SiteBMS_Home','Project_Board','Job_Orders','Closeout','Warranty']),
  ('09_Records', ARRAY['Prospect','Lead','Offer','Pending_Project','Project','Job','Job_Order','Other_Charge','Warranty']),
  ('10_Shared_Surfaces', ARRAY['Header','Nav','Footer','Empty_States','Errors','Sign_In','Reset_Password','Invitation_Redemption','Email_Templates','Brand_Pages','Owner_Manual_Reader','Insider_Dossiers']),
  ('11_Founder_App', ARRAY['Founder_Console','Request_Queue','Inbox','Invitations','Tickets','Digest','Signals','Read_Heatmap','Evidence_Index','Intake_Lane','Concept_Lab','Owner_Manual','Backlog','Ledger','Broadcast_Control','Situation_Room']),
  ('12_Named_Not_Built', ARRAY['MarketApp','BooksForge','MusicApp','MovieApp','MyGPT.TV','Referraltor'])
) AS t(b, arr)
CROSS JOIN LATERAL unnest(t.arr) WITH ORDINALITY AS s(slug, ord);

UPDATE public.screen_pages SET class = 'C4' WHERE branch = '11_Founder_App';
UPDATE public.screen_pages SET class = 'C0' WHERE branch IN ('01_Public_Website','02_Persona_Front_Doors');

UPDATE public.screen_pages
SET status = 'built', truth = 'FACT', route = '/kimosabe',
    pattern_links = ARRAY['docs/strategy/KIMOSABE-POSITIONING.md', 'docs/law/DECISIONS.md ADR-019']
WHERE branch = '02_Persona_Front_Doors' AND slug = 'Kimosabe';

UPDATE public.screen_pages
SET status = 'built', truth = 'FACT', route = '/buddy-claim',
    pattern_links = ARRAY['docs/law/DECISIONS.md ADR-019']
WHERE branch = '02_Persona_Front_Doors' AND slug = 'Buddy_Claim';

UPDATE public.screen_pages
SET status = 'specified', truth = 'OPEN',
    pattern_links = ARRAY['docs/requirements/REQUIREMENTS.md', 'docs/law/SHARED-SPINE.md']
WHERE branch = '05_ISR' AND slug = 'Get_Set_Up';