## Sprint 0.10 — Founder Digest + Insider "What's New"

The room is now capture-and-track complete. The next gap is **cadence**: the founder shouldn't have to poll five tabs to know what changed, and returning insiders shouldn't have to guess which dossiers moved since their last visit. This sprint closes that loop on both sides — still no email required, purely in-app.

### What ships

**1. Founder Daily Digest (`/admin/digest`)**
A single scannable page the founder opens each morning. One column, reverse-chronological, grouped by day:
- New briefing requests (with one-click open in inbox)
- New PrepareAmerica applications
- New insider messages on any dossier (with the quoted snippet)
- New invitations redeemed
- Dossiers opened by insiders who had been dormant >7 days ("re-engagement" callout)

Filter: last 24h / 7d / 30d. Each row deep-links to the exact record.

**2. Insider "What's New" strip on `/insider`**
Above the dossier index, a compact strip showing, for the current insider:
- Dossiers with founder notes added since their last open ("Founder added a note")
- Dossiers with new insider messages since their last open ("2 new messages")
- Dossiers they have never opened ("Unread")

Uses the existing `insider_access_log` — no new tracking table. Each item is a direct link into the dossier.

**3. Section-level unread markers inside the dossier reader**
Small `NEW` chip next to any section heading where a note or message was added after this insider's most recent open of that dossier. Reader logs the open on unmount so the "new" state resets naturally on next visit.

### What this is NOT

- Not email. Digest is in-app only until the sender domain is verified.
- Not notifications/toasts. This is a pull surface, not push.
- No new tables. Everything derives from `insider_access_log`, `dossier_notes`, `dossier_messages`, `briefing_requests`, `conference_applications`, `insider_invitations`.

### Technical notes

- New server functions in `src/lib/dossier.functions.ts`: `getFounderDigest({ windowDays })`, `getInsiderWhatsNew()`.
- New route `src/routes/_authenticated/admin/digest.tsx`, gated to `founder_admin`.
- Insider index (`src/routes/_authenticated/insider/index.tsx`) and reader (`dossier.$slug.tsx`) updated in place — no new components beyond a small `NewChip`.
- Reader currently logs open on mount; add an unmount log so "last open" reflects the actual session end, making the unread computation honest.
- Header gets a "Digest" link next to "Inbox" / "Signals" for founder admins.

### Story-order & truth discipline

Digest and What's-New surfaces both preserve canonical dossier order (RRCA → ClaimExpress → ClaimStore → USA Foundry → PrepareAmerica) when listing per-dossier items. No content authored here — all rendered items already carry their own truth labels from source.

Approve and I'll build it.
