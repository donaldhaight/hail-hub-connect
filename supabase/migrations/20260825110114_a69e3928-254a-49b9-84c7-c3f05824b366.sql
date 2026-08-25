CREATE TABLE public.backlog_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL DEFAULT 'Operations',
  title text NOT NULL,
  summary text NOT NULL DEFAULT '',
  detail text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'idea',
  priority integer NOT NULL DEFAULT 2,
  sprint_label text,
  position integer NOT NULL DEFAULT 0,
  build_requested_at timestamptz,
  build_requested_by uuid,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.backlog_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES public.backlog_items(id) ON DELETE CASCADE,
  author_id uuid,
  author_kind text NOT NULL DEFAULT 'founder',
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.backlog_items TO authenticated;
GRANT ALL ON public.backlog_items TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.backlog_comments TO authenticated;
GRANT ALL ON public.backlog_comments TO service_role;

ALTER TABLE public.backlog_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backlog_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Founder admin manages backlog items"
ON public.backlog_items FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'founder_admin'))
WITH CHECK (public.has_role(auth.uid(), 'founder_admin'));

CREATE POLICY "Founder admin manages backlog comments"
ON public.backlog_comments FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'founder_admin'))
WITH CHECK (public.has_role(auth.uid(), 'founder_admin'));

CREATE TRIGGER backlog_items_updated_at
BEFORE UPDATE ON public.backlog_items
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX backlog_items_category_idx ON public.backlog_items (category, position);
CREATE INDEX backlog_comments_item_idx ON public.backlog_comments (item_id, created_at);

INSERT INTO public.backlog_items (category, title, summary, detail, status, priority, sprint_label, position) VALUES
('Domain & Email', 'Connect prepareamerica.com', 'Point root and www at Lovable, then repoint canonical and OG URLs.', 'Project Settings -> Domains -> Connect Domain. Add both prepareamerica.com and www.prepareamerica.com as separate entries, choose a primary, then wait for DNS propagation and SSL. Once live, confirm SITE_URL in src/lib/site.ts matches and re-publish so every canonical link and social card points at the custom domain.', 'planned', 1, 'Sprint 3.1', 1),
('Domain & Email', 'Verify the email sender domain', 'Stand up a sender domain so transactional mail can leave the building.', 'Set up the email sender domain in Lovable Cloud using the same domain. Setup delegates a mail subdomain and manages the records automatically. Nothing sends until the records verify.', 'planned', 1, 'Sprint 3.1', 2),
('Domain & Email', 'Activate the six email templates', 'Wire the stubbed templates in src/lib/email.ts to live sending.', 'src/lib/email.ts already carries fully-formed templates for founder notification, applicant auto-reply, insider invitation, new insider message, founder reply posted, and seat confirmation. The send function is a no-op until a verified sender exists. Once verified, swap the stub body for a real send and confirm each call site fires.', 'planned', 1, 'Sprint 3.1', 3),
('Operations', 'Rename the Lovable URL slug', 'hail-hub-connect is a fossil from an earlier framing.', 'The published subdomain still reads hail-hub-connect.lovable.app. Rename it to something that matches the mission, for example prepareamerica. Do this before the URL is shared widely.', 'planned', 2, 'Sprint 3.1', 1),
('Operations', 'Back the repository up to GitHub', 'Own the source outside Lovable.', 'Connect the project to a GitHub repository you own and confirm the first sync includes src, docs, supabase migrations, and the plan archive. Record the repo URL in docs/DECISIONS.md.', 'planned', 2, 'Sprint 3.1', 2),
('Broadcast', 'Update the founder tour', 'The tour predates the broadcast room and run-of-show editor.', 'Refresh /admin/tour with the broadcast control center, the public broadcast room at /first-congress, the ticket ledger, and the new run-of-show fields (segment type, speaker, duration). Capture fresh screenshots.', 'idea', 2, 'Sprint 3.2', 1),
('Season 1 Platform', 'Siteforum handoff prep', 'Season 1 runs on the original codebase; define the seam.', 'Season 1 opens March 1 2027 on the legacy Siteforum platform. Define what data crosses the seam (delegates, seat licenses, season roster), who owns which surface, and what this app hands over versus keeps.', 'idea', 3, 'Season 1', 1),
('Strategy', 'Second Congress seat machinery', 'Turn First Congress tickets into February delegate seats.', 'Build the confirmation flow that converts a First Congress invitation into a Second Congress delegate seat for 2-14-2027: seat offer, acceptance window, expiry, and the personal seat license tier attached to it.', 'idea', 2, 'Sprint 3.3', 1);