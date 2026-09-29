# Next Sprint: Timeline Sync, RRCA Door, SelfInsurity Door

Doors are content only. Nothing here comes before its place in the locked work order. All copy is preview copy. Nothing gets published without your instruction.

## 1. Update the timeline across the corpus (documentation only)

Record the revised calendar as a dated ADR (DECISION):
- **2026-11-01**: Announcement at the #PrepareAmerica Conference.
- **2026-11-01 to 2027-03-01**: Pre Season.
- **Super Bowl Weekend 2027**: First Continental Congress.
- **2027-03-01 to 2027-09-30**: Season 1.

Update the season table in `PRESEASON-DOMAINS.md` and the calendar notes in `00-START-HERE.md`. Add one register row (with a matching board row) listing public-page conflicts as fluid and non-blocking. The public pages themselves stay as they are for now.

## 2. RRCA Door (third canonical Door)

- Add an `rrca` persona record to the existing FrontDoor engine. It gets its own promise version, sections, interest options and disclosure.
- The language is "Strategic Partner / Advisor". There is no capital intake and no investment wording.
- RRCA is presented as the first operating proof, and the page describes intent only.
- Interest options are self-declared only (contractor, strategic partner/advisor, property owner, observer). An interest never grants authority.
- New route `/rrca`. The `/b/rrca` brand card stays unchanged and separate.
- Map `rrcausa.com` and its `www` address to the Door, add it to the Surface Registry, and write Screen Book persona notes.

## 3. SelfInsurity Door (fourth canonical Door, message only)

- Add a `selfinsurity` persona. RoofLac / Lifetime Roof Assurance is described as a concept carried by SelfInsurity, marked PREVIEW/FUTURE.
- The page creates no Property record, gives no quote, makes no offer and takes no payment. A strong disclosure states that it is not insurance and not an offer.
- New route `/selfinsurity`. The `/b/selfinsurity` brand card is kept. Map `selfinsurity.com` and its `www` address, and add the Door to the Registry.

## 4. Manual and register

- Write Manual chapter 86, "The Calendar Turned", covering the timeline change and the two new Doors.
- Add register and board rows with the same IDs: the RRCA and SelfInsurity Doors (done, preview), A78 attribution persistence (still waiting on your authorization), and Circle ingestion as the next lane.

## Out of scope

No schema changes, no attribution persistence, no NRA / Market Applications Doors, no publishing, and no edits to public copy for the timeline.

## Technical details

- Edit `src/content/personas.ts` to add two persona records and new `[data-brand]` palette tokens in `src/styles.css`.
- Add `src/routes/rrca.tsx` and `src/routes/selfinsurity.tsx`, modeled on `buddy-claim.tsx`, each with its own `head()`.
- Add the host mappings in `src/lib/door-hosts.ts`. The allowed hosts are already present in `vite.config.ts`.
- Add the Registry entries to `src/content/surfaces.ts`, the sitemap entries, and the Manual chapter through a data insert.
- Verify by opening `/rrca`, `/selfinsurity`, `/b/rrca` and `/b/selfinsurity` (each should return 200) and checking the build log.
