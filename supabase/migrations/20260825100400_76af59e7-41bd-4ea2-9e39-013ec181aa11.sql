-- 1. Make room in Part III and renumber downstream chapters
UPDATE public.manual_chapters SET position = 34, number_label = '17' WHERE slug = 'event-sponsorship';
UPDATE public.manual_chapters SET position = 33, number_label = '16' WHERE slug = 'event-seats';

UPDATE public.manual_chapters
   SET number_label = (number_label::int + 2)::text
 WHERE part IN ('IV', 'V') AND number_label ~ '^[0-9]+$';

-- 2. Part III — revised overview
UPDATE public.manual_chapters SET
  title = 'PrepareAmerica',
  subtitle = 'The mission, not the occasion',
  truth = 'DECISION',
  body = 'PrepareAmerica is the mission. It is not an event, and it is not a company. It is the name for the decade-long argument that if the insurance restoration market can be coordinated, larger things can be coordinated too.

Within the mission there are named occasions. The First Congress is streamed on November 1, 2026 — a reveal, an announcement, and an invitation. The Second Congress is convened in person on Super Bowl weekend 2027 at Gratitude Ranch in Flower Mound, Texas, before three hundred delegates, and it is where Season One is ratified.

The audience is deliberately mixed: C-level industry executives, venture investors, capitalized contractors, government and policy staff. The mixture is the argument. A coordination thesis that can only be explained to one of those four groups is not a coordination thesis.'
WHERE slug = 'event-overview';

-- 3. Part III — new chapters
INSERT INTO public.manual_chapters (slug, part, position, number_label, title, subtitle, truth, confidentiality, body) VALUES
('the-two-congresses', 'III', 31, '14', 'The Two Congresses', 'November declares. February decides.', 'DECISION', 'C1',
'The framing is Continental and it is not decoration. The First Continental Congress convened to state a grievance and to establish that a body existed at all. The Second convened to act. Adopting the sequence commits us to something specific: November declares, February decides.

The First Congress — November 1, 2026 — is streamed. It is not a destination and nobody travels to it. It is the reveal of the architecture, the announcement of the convener, and the issuance of invitations to the body that will actually sit.

The Second Congress — Super Bowl weekend 2027, Gratitude Ranch, Flower Mound, Texas — is convened in person before three hundred delegates. It ratifies Season One. From there the Owners Meeting recurs annually on Super Bowl weekend, borrowing a cultural date rather than asking anyone to remember a new one.

One tension is deliberate and worth keeping. The Continental frame is heavy and historic; the Super Bowl frame is popular and commercial. Held together they read as a movement that is serious about power and unembarrassed about audience. Held apart, either alone reads as costume.'),

('the-invitation-ladder', 'III', 32, '15', 'The Invitation Ladder', 'You need an invitation to receive the invitation.', 'DECISION', 'C1',
'Five gates, each earned, each controlled by the convener.

Referral. A qualified insider nominates a name, or a stranger requests a briefing and is triaged by hand.

Ticket. An approved request becomes a ticket to the First Congress, issued at a tier, addressed by a private credential rather than an account. The stream is not marketing. It is the qualifying round, and holding a ticket is itself a credential.

Invitation. Ticket holders are invited to the Second Congress. Stakeholder-tier holders carry a standing right; observer-tier holders apply.

Delegate seat. Three hundred seats, hard capped in software, confirmed and logged.

Season One participant. Delegates carry into the operating season that opens March 1, 2027.

The mechanic states itself: you need an invitation to receive the invitation. That is what makes the scarcity real rather than asserted. Between now and November the front door has one job — convert a referred stranger into a ticket holder. After November it has a different one — convert ticket holders into delegates.'),

-- 4. Part V — new chapters
('the-season-ladder', 'V', 64, '39', 'The Season Ladder', 'Two quasi-beta seasons, then the launch', 'DECISION', 'C2',
'Seasons are the unit of operation. Congresses open them; Owners Meetings revise them.

Season One runs March 1, 2027 through September 30, 2027. It is short on purpose. A compressed season produces a full cycle of real transactions, real disputes, and real settlement behavior inside seven months, and it ends early enough that everything learned can be written into rules before the next Owners Meeting.

Season Two opens after the Owners Meeting on Super Bowl weekend 2028 and reflects the rule changes ratified there. It is the second quasi-beta, not the launch.

Season Three opens after the Owners Meeting on Super Bowl weekend 2029. It is the fully fueled and vetted launch — the first season that is not a beta.

Winter Meeting dates float with Super Bowl weekend and are never asserted as a fixed day until the schedule is published. Every surface in this system reads them from the season calendar module rather than from prose.'),

('the-two-track-platform', 'V', 65, '40', 'The Two-Track Platform', 'Season One does not need to be built', 'FACT', 'C3',
'The strongest fact in this project is that the platform for Season One already exists.

FACT. The original codebase was developed, hosted, and managed by the original team at Siteforum.com. It has an operating history. It is not a prototype and it is not a plan.

DECISION. Seasons One and Two run on that proven codebase under founder direction, while the Board and the Dev Team build the successor platform in parallel. Two tracks, deliberately separated: the operating track cannot be destabilized by the building track, and the building track cannot be rushed by the operating track.

This is the risk answer for capital. Between Day One on November 1, 2026 and the Season One milestone, the exposure is execution risk, not build risk. Nothing has to be invented for the first season to run.

HYPOTHESIS. The successor platform is ready to take Season Three. That date is not committed and must not be presented as one.

This site is not the operating platform and does not need to become it. Its job is to hand qualified people to the platform that already exists.');

-- 5. Rewrite the legacy chapters that still describe a single physical conference
UPDATE public.manual_chapters SET
  title = 'The Seat Model',
  subtitle = 'Tickets, tiers, and three hundred delegate seats',
  body = 'Two instruments, and they are not the same thing.

A ticket admits its holder to the First Congress stream. It is issued at one of two tiers. Observer carries admission to the broadcast and the right to apply for an invitation to the Second Congress. Stakeholder carries admission plus a standing right to a delegate seat, and may be transferred only with the convener''s approval. Neither tier is a security, an offering, or a transaction, and neither is priced in this manual.

The structure is borrowed knowingly from the seat license. A seat license is not a seat and not a ticket — it is the right to buy one, granted before the asset exists. That is what makes it a commitment mechanism rather than a sale, and it is the closest existing analogue to the invitation ladder.

A delegate seat is admission to the Second Congress in person. Capacity is three hundred and the cap is enforced in software, not in judgment. When confirmed seats reach three hundred, further approvals move to the waitlist automatically, and every seat state change is written to an audit table.

Confirmed delegates receive a private link to their own logistics surface where they manage plus-ones, hotel need, and dietary or access notes. The founder can promote from the waitlist, edit logistics on a delegate''s behalf, and export the full roster.

Applications are taken publicly and triaged privately. Application does not imply admission.'
WHERE slug = 'event-seats';

UPDATE public.manual_chapters SET
  body = 'There are two roles today.

Founder Admin — full access to every private surface, including all triage, all analytics, and all editing.

Qualified Insider — access to the dossier room, the discussion threads, attachments, and the referral form. No access to any /admin surface.

Beyond roles there are two credential-addressed surfaces that require no account at all: a ticket holder opens the First Congress by private credential, and a confirmed delegate opens their logistics room by private link.

Roles live in their own table, never on a user record, and every role check runs through a single security-definer function. Sign-in is by Google or by email and password. There is no anonymous sign-up: a person becomes an insider only by redeeming a single-use invitation token issued by the founder.

Not built yet: sponsor, delegate, and observer roles; per-dossier access grants; expiring insider access.'
WHERE slug = 'access-and-roles';

UPDATE public.manual_chapters SET
  body = 'Purpose. The single triage surface for everything inbound: briefing requests, Congress applications, referrals, invitations, discussion, and the itinerary.

Who can see it. Founder Admin.

What you do here. Review each briefing request and approve or decline it. Review each Congress application, issue a ticket at a tier, grant or waitlist a delegate seat, and edit plus-ones, hotel, and dietary notes. Write internal notes on any record. Copy a delegate''s private link. Export the roster.

What the system does. Deduplicates requests by email. Enforces the three-hundred-delegate cap and moves overflow to the waitlist. Writes every seat state change to the audit table. Generates a single-use invitation token when a request is approved.

Related surface. The ticket ledger at /admin/tickets manages the First Congress half of the ladder — tier assignment, issuance, and the holder''s credential link.

Not built yet. Notification emails on submission, bulk triage, saved filters, assignment to a second reviewer.'
WHERE slug = 'surface-inbox';

UPDATE public.manual_chapters SET
  body = 'Purpose. Seed the insider network directly, rather than waiting for inbound.

Who can see it. Founder Admin.

What you do here. Issue an invitation to a named email, copy the redemption link, resend it, or revoke it.

What the system does. Generates a single-use token bound to the invitation, records its source (direct, briefing request, Congress application, or referral), and marks it consumed on redemption. Redemption at /insider/accept creates the auth user if needed and assigns the qualified insider role.

Not built yet. Invitation expiry windows, invitation templates by audience, delivery by email rather than by copied link.'
WHERE slug = 'surface-invitations';

UPDATE public.manual_chapters SET
  body = 'Purpose. Build and publish the run of show for a Congress.

Who can see it. Founder Admin.

What you do here. Create, edit, reorder, and delete agenda items; publish or unpublish each one.

What the system does. Published items appear in time order on the delegate room and on the broadcast page. Unpublished items are invisible outside the admin surface.

Not built yet. Speaker records, room and track assignment, per-session capacity, delegate session selection.'
WHERE slug = 'surface-itinerary';

UPDATE public.manual_chapters SET
  title = 'Delegate Room',
  subtitle = '/prepare-america/confirmed?t=token',
  body = 'Purpose. A private, token-addressed surface for a confirmed delegate — no account required.

Who can see it. Anyone holding a valid delegate token.

What you do here. Confirm seat details, set plus-ones, indicate hotel need, add dietary or access notes, read the published run of show, and cross into the insider room if you also hold an invitation.

What the system does. Validates the token, writes logistics changes back to the application record, and renders only published itinerary items.

Not built yet. Confirmation and change emails, QR check-in, badge printing, travel details.'
WHERE slug = 'surface-attendee';

UPDATE public.manual_chapters SET
  body = 'Complete. The public site qualifies inbound interest and states the thesis without offering language. The private layer runs triage, invitations, the dossier corpus, discussion, evidence, referrals, read-depth analytics, ticket issuance for the First Congress, and delegate logistics against a hard three-hundred-seat cap for the Second.

Delivered across eighteen sprints, documented in the sprint history. Open item: repository backup to an owner-controlled remote.'
WHERE slug = 'phase-0';

UPDATE public.manual_chapters SET
  body = 'Each of the seven groups gets its own understated front door, disclosed in the three-layer order, with brand names withheld from signed-out visitors. The switcher connects them. The architecture page shows the geometry.

Remaining in Phase 1: per-brand narrative depth, brand-specific visual identity beyond the accent palette, and a decision on which brand front doors go public before the First Congress.'
WHERE slug = 'phase-1';