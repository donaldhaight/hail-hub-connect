import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader, Section } from "@/components/briefing/PageShell";

import shotIndex from "@/assets/tour/front-index.png";
import shotWhyRRCA from "@/assets/tour/front-why-rrca.png";
import shotIndustry from "@/assets/tour/front-industry-problem.png";
import shotPOC from "@/assets/tour/front-proof-of-concept.png";
import shotVision from "@/assets/tour/front-vision.png";
import shotPrepare from "@/assets/tour/front-prepare-america.png";
import shotFounder from "@/assets/tour/front-founder.png";
import shotInvestors from "@/assets/tour/front-investors.png";
import shotPolicy from "@/assets/tour/front-policy.png";
import shotWhyPrepare from "@/assets/tour/front-why-prepare-america.png";
import shotRequest from "@/assets/tour/capture-request-briefing.png";
import shotAuth from "@/assets/tour/access-auth.png";

const TITLE = "Application Tour";
const DESC = "An annotated walkthrough of every surface built in Phase 0 of the PrepareAmerica briefing room.";

export const Route = createFileRoute("/_authenticated/admin/tour")({
  head: () => ({
    meta: [
      { title: `${TITLE} — PrepareAmerica` },
      { name: "description", content: DESC },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: TourPage,
});

type Shot = { src?: string; path: string; title: string; body: string };
type Act = { number: string; title: string; lede: string; shots: Shot[] };

const ACTS: Act[] = [
  {
    number: "Act I",
    title: "The Front Door",
    lede: "Understated public surfaces designed to qualify C-level executives, venture capitalists, funded contractors, and government think tanks — without revealing the private machinery behind the curtain.",
    shots: [
      { src: shotIndex, path: "/", title: "Home", body: "The landing dossier. Sets tone, load-bearing story order (RRCA → Case Study → ClaimExpress → ClaimStore → USA Foundry), and a single primary call-to-action: Request a Private Briefing." },
      { src: shotWhyRRCA, path: "/why-rrca", title: "Why RRCA", body: "Names the animal: the Roofing & Restoration Contractors of America thesis, framed as an industry-wide restructuring rather than another SaaS pitch." },
      { src: shotIndustry, path: "/industry-problem", title: "Industry Problem", body: "The macro case for restructuring — 25+ years of first-hand pattern recognition compressed into a diagnostic dossier." },
      { src: shotPOC, path: "/proof-of-concept", title: "Proof of Concept", body: "ClaimExpress as the working precedent. Anchors credibility before the vision expands." },
      { src: shotVision, path: "/vision", title: "Vision", body: "The Diller-style rollup: ClaimStore, ClaimsBank, ClaimLoan, ClaimCoin as an integrated capital and lead network for the insurance-restoration market." },
      { src: shotPrepare, path: "/prepare-america", title: "PrepareAmerica Conference", body: "The convening event — Nov 1, 2026, Gratitude Ranch, Flower Mound TX. Live seat counter and application form driving the funnel." },
      { src: shotFounder, path: "/founder", title: "Founder Statement", body: "The narrative voice. Signals sole ownership, right to pivot, and the DH method of morphing established patterns into the ClaimStore scheme." },
      { src: shotInvestors, path: "/investors", title: "For Investors", body: "Constituency-specific landing page: rollup thesis, capital stack, and where venture dollars fit inside a foundry structure." },
      { src: shotPolicy, path: "/policy", title: "For Policy & Government", body: "A standardized disaster-recovery protocol written for think tanks, agencies, and elected officials — not for operators." },
      { src: shotWhyPrepare, path: "/why-prepare-america", title: "Why PrepareAmerica", body: "The convening narrative. Explains why 300 seats, why this room, why now." },
    ],
  },
  {
    number: "Act II",
    title: "Capture & Triage",
    lede: "How anonymous visitors become qualified insiders. Every request enters a founder-controlled funnel — no automated approvals, no anonymous access to the interior.",
    shots: [
      { src: shotRequest, path: "/request-briefing", title: "Request a Private Briefing", body: "Server-validated intake form with rate limiting. Submissions flow into the Briefing tab of the founder inbox." },
      { path: "/admin/inbox — Briefing tab", title: "Founder Inbox: Briefing", body: "Triage panel for briefing requests: Approve, Decline, or generate a single-use insider invitation link. Every action writes to the audit log." },
      { path: "/admin/inbox — Conference tab", title: "Founder Inbox: Conference", body: "Conference applications with role tags (Executive, Investor, Contractor, Policy). Capacity meter shows live seat count against the 300 hard cap; overflow auto-waitlists." },
      { path: "/admin/inbox — Referrals tab", title: "Founder Inbox: Referrals", body: "Insider-nominated candidates. One-click approval promotes them and drops an invitation into their inbox." },
      { path: "/admin/inbox — Invitations tab", title: "Founder Inbox: Invitations", body: "Live view of outstanding invitations. Revoke, resend, or seed direct invitations without an inbound request." },
      { path: "/admin/inbox — Itinerary tab", title: "Founder Inbox: Itinerary", body: "CRUD for the PrepareAmerica agenda. Items publish instantly to every confirmed attendee's private room." },
      { path: "/admin/inbox — Discussion tab", title: "Founder Inbox: Discussion", body: "Global Q&A feed. Every insider-authored dossier message rolls up here for founder reply — no message goes unseen." },
    ],
  },
  {
    number: "Act III",
    title: "The Insider Room",
    lede: "The interior. Redacted, load-bearing, and instrumented for read-depth. Access is gated by single-use, expiring tokens tied to a specific email.",
    shots: [
      { src: shotAuth, path: "/auth", title: "Founder & Insider Sign In", body: "Email/password + Google. First sign-in on this project auto-claims founder rights. Others need a redeemed invitation to see any interior surface." },
      { path: "/insider.accept?token=…", title: "Insider Invitation Redemption", body: "Single-use token, email-matched, time-bound. Rejection reasons are explicit (expired, revoked, email mismatch, already redeemed)." },
      { path: "/insider", title: "Working Dossier Index", body: "Load-bearing story order enforced. NEW badges surface any dossier or section changed since the insider's last visit." },
      { path: "/insider/dossier/$slug", title: "Dossier Reader", body: "Per-section truth chips (FACT, ASSERTION, DECISION, HYPOTHESIS, SIMULATION, OPEN). IntersectionObserver-based read tracking with explicit Mark-as-read. Attachments render as evidence cards with signed URLs from the private storage bucket." },
      { path: "/insider/dossier/$slug — Discussion", title: "Section Q&A", body: "Flat threads tied to a specific dossier section. Founder notes render inline; insider questions notify the founder immediately." },
      { path: "/insider/refer", title: "Nominate an Insider", body: "Peer-to-peer referral form. Referrals land in the founder's Referrals tab for triage rather than auto-inviting." },
    ],
  },
  {
    number: "Act IV",
    title: "Founder Intelligence",
    lede: "The signals layer. Everything an insider does in Act III becomes a signal here — read-depth, dwell time, attachment opens, message velocity, referral momentum. This is where the founder decides who to move up the funnel.",
    shots: [
      { path: "/admin/digest", title: "Daily Digest", body: "Rollup of new briefing requests, conference applications, messages, re-engagement events, most-engaged insiders, and referral momentum. One screen answers 'what happened yesterday.'" },
      { path: "/admin/signals", title: "Insider Signals", body: "Per-insider dashboard: dossiers opened, total opens, last activity, message count, referrals sent. Sortable to find the most and least engaged." },
      { path: "/admin/reads", title: "Section-Level Heatmap", body: "Per-dossier, per-section read heatmap. Shows which passages are landing and which are being skipped — direct feedback on the corpus." },
      { path: "/admin/edits", title: "Corpus Edit History", body: "Full audit trail of every dossier heading, truth label, and body change. Nothing edits the story silently." },
    ],
  },
  {
    number: "Act V",
    title: "Conference Operations",
    lede: "The Nov 1, 2026 event as a live system: 300-seat hard cap, waitlist promotion, token-gated attendee rooms, and per-attendee logistics capture.",
    shots: [
      { path: "/prepare-america (capacity meter)", title: "Live Capacity Meter", body: "Visible on the public conference page and inside the founder inbox. Automatically flips new applications to waitlist when confirmed seats reach 300." },
      { path: "/admin/inbox → seat lifecycle", title: "Seat Lifecycle Controls", body: "Applied → Confirmed → Waitlisted → Declined transitions, each written to the seat-events audit table. Confirming a conference guest optionally promotes them to insider access." },
      { path: "/prepare-america/confirmed?token=…", title: "Attendee Private Page", body: "Token-gated (not behind sign-in). Confirmed guests see their seat details, submit plus-ones / hotel / dietary needs, and view the live itinerary. Excluded from the sitemap and robots.txt." },
      { path: "/admin/inbox — Itinerary", title: "Itinerary Editor", body: "Founder-only CRUD. Every published change appears on every attendee page the moment it's saved." },
    ],
  },
];

function TourPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Founder tour"
        title="Everything built in Phase 0."
        lede="A private, illustrated walkthrough of every public and interior surface. Screenshots are captured at 1440×900 from the running application. Interior views describe surfaces you can also open directly."
        confidentiality="C2"
      />
      <div className="border-b border-border bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-4 text-[11px] font-mono uppercase tracking-[0.18em] text-silver">
          Confidentiality C2 — internal preview of private machinery. Do not circulate.
        </div>
      </div>

      {ACTS.map((act) => (
        <Section key={act.number} number={act.number} title={act.title}>
          <p className="mb-8 text-[15px] leading-relaxed text-muted-foreground">{act.lede}</p>
          <div className="space-y-10">
            {act.shots.map((shot) => (
              <article key={shot.path} className="border border-border bg-card">
                {shot.src ? (
                  <a
                    href={shot.path.startsWith("/") ? shot.path : undefined}
                    target={shot.path.startsWith("/") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="block border-b border-border bg-paper"
                  >
                    <img
                      src={shot.src}
                      alt={`Screenshot of ${shot.title} at ${shot.path}`}
                      className="block h-auto w-full"
                      loading="lazy"
                    />
                  </a>
                ) : (
                  <div className="flex items-center justify-center border-b border-dashed border-border bg-paper px-6 py-10 text-center">
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
                      Interior view — open live to inspect
                    </span>
                  </div>
                )}
                <div className="px-5 py-4">
                  <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-serif text-xl text-ink">{shot.title}</h3>
                    <code className="font-mono text-[11px] text-silver">{shot.path}</code>
                  </div>
                  <p className="text-[14px] leading-relaxed text-ink/85">{shot.body}</p>
                </div>
              </article>
            ))}
          </div>
        </Section>
      ))}

      <Section number="Appendix" title="Re-capturing screenshots">
        <p className="text-[15px] leading-relaxed text-ink/85">
          Public-page screenshots in this tour were captured via headless Chromium against the running preview. Interior surfaces (
          <code className="font-mono text-[12px]">/admin/*</code>,{" "}
          <code className="font-mono text-[12px]">/insider/*</code>,{" "}
          <code className="font-mono text-[12px]">/prepare-america/confirmed</code>) require a signed-in founder session; regenerating them means running the capture script with the founder's Supabase session injected, and seeding scoped demo data so no screen looks empty. Ask for a recapture whenever the UI meaningfully changes.
        </p>
      </Section>
    </PageShell>
  );
}
