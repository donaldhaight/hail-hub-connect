# The Screen Book — manifest

> **Status:** in progress · **Class:** C2 · **Last revised:** 2026-09-10
> One folder per surface. Every folder is an authorized container declaration (ADR-021)
> and everything inside it is Expression (ADR-020).
> Reading order and the full corpus map: [`docs/00-START-HERE.md`](../00-START-HERE.md)

This book describes screens. It does not create obligations. Where a screen needs something
the corpus has not yet ruled, the need goes in that screen's `open-questions.md` **and** on
`docs/work/OPEN-ITEMS.md` and the founder backlog board, same turn, same words.

---

## 1. The four rules

1. **Expression never binds.** Source and Pattern bind (ADR-020). Nothing written here
   overrides `docs/law/`, `docs/requirements/`, or a recorded decision.
2. **Every folder names its Pattern.** The front matter of `purpose.md` carries a
   `pattern:` line pointing at the corpus lines this screen expresses. A screen folder with
   no Pattern link is a defect, not a draft.
3. **Every variant carries its labels.** Audience, persona, moment, mood, purpose,
   intensity, truth label, confidentiality class. Siblings accumulate; none overwrites
   another; none is "the real one."
4. **Unanswered questions leave the folder.** They go to the register with an ID, or they
   rot here unseen.

Band 3 never appears in this book: no storm targeting, kill-zone or fringe tagging, carrier
routes, ghost profiles, offer generation, or outreach sequencing — in any folder, any
variant, any intensity.

## 2. The tree

```text
docs/screens/
├── 00-SCREEN-BOOK.md          this file
├── SCREEN-TEMPLATE/           the blank facet set, copied for each new screen
├── 01_Public_Website/         Home · Thesis · Case_Study · Architecture · Roles ·
│                              Congress · Founder · Investors · Policy ·
│                              Request_Briefing · Sign_In
├── 02_Persona_Front_Doors/    Kimosabe · Buddy_Claim · Future_Personas
├── 03_Interested_User/        Arrival · Conversation · Anonymous_File · Wallet ·
│                              Ledger · Memory · Return_Visit · Become_A_Member
├── 04_App_Home/               Home_Page · Guide_Channel · Search · New · Tasks ·
│                              Account · Role_Switcher · Role_Store
├── 05_ISR/                    Get_Set_Up · Day_01 … Day_10 · Certification ·
│                              ISR_Home · Daily_Work
├── 06_LC/                     Get_Set_Up · Verification · Offer_Approval ·
│                              Book_Of_Work · LC_Home
├── 07_Property_Owner/         Property_Setup · Free_Quote · RoofLac_Offer ·
│                              Good_Better_Best · PO_Home
├── 08_Construction_Manager/   SiteBMS_Home · Project_Board · Job_Orders ·
│                              Closeout · Warranty
├── 09_Records/                Prospect · Lead · Offer · Pending_Project · Project ·
│                              Job · Job_Order · Other_Charge · Warranty
├── 10_Shared_Surfaces/        Header · Nav · Footer · Empty_States · Errors ·
│                              Sign_In · Reset_Password · Invitation_Redemption ·
│                              Email_Templates · Brand_Pages · Owner_Manual_Reader ·
│                              Insider_Dossiers
├── 11_Founder_App/            Founder_Console · Request_Queue · Inbox · Invitations ·
│                              Tickets · Digest · Signals · Read_Heatmap ·
│                              Evidence_Index · Intake_Lane · Concept_Lab ·
│                              Owner_Manual · Backlog · Ledger · Broadcast_Control ·
│                              Situation_Room
└── 12_Named_Not_Built/        MarketApp · BooksForge · MusicApp · MovieApp · MyGPT.TV ·
                               Referraltor
```

Branches 06 through 10 and 12 were added to the founder's original outline. They are the
positions, records, shared surfaces and promises the outline had no home for.

## 3. A screen folder

Copy [`SCREEN-TEMPLATE/`](SCREEN-TEMPLATE/). Twelve files, one per facet, plus two
directories:

| File | Holds | Container facet (ADR-021) |
|---|---|---|
| `purpose.md` | Why this screen exists, in one line, plus front matter | Purpose |
| `permissions.md` | Which roles may open it, under Role + applicable Relationship + applicable Assignment | Permitted roles |
| `records.md` | Which records may appear inside it | Permitted records |
| `actions.md` | What may be done here | Permitted actions |
| `tools.md` | What the guide may operate on the person's behalf | Available tools |
| `context.md` | What must be known before it can render | Required context |
| `completion.md` | What ends the work this container holds | Completion event |
| `variants/` | Perception Library siblings for this screen | Presentation options |
| `content.md` | The default rendering's copy | — |
| `layout.md` | Structure and order, not pixels | — |
| `components.md` | Which existing components it uses or needs | — |
| `states.md` | Empty, loading, partial, error, denied, done | — |
| `persona.md` | How each persona wears this screen | — |
| `evidence/` | Screenshots, legacy screens, dated artifacts — Source, never edited | — |
| `open-questions.md` | Every unanswered thing, each with a register ID | — |

`records.md`, `tools.md`, `context.md` and `completion.md` are the four facets the original
outline had nowhere to put. Naming them is the difference between a content brief and a
container declaration.

## 4. Front matter

Every `purpose.md` opens with:

```yaml
---
screen: 02_Persona_Front_Doors/Kimosabe
status: built | specified | empty
class: C0 | C1 | C2 | C3 | C4
truth: FACT | ASSERTION | DECISION | HYPOTHESIS | SIMULATION | OPEN
pattern:
  - docs/strategy/KIMOSABE-POSITIONING.md §2
route: /kimosabe
register: A29, C37
---
```

`status: built` means the screen exists in the running app and this folder describes it.
`specified` means described, not built. `empty` means the folder exists to hold the place.

## 5. Worked examples

- [`02_Persona_Front_Doors/Kimosabe/`](02_Persona_Front_Doors/Kimosabe/) — a built screen,
  read off the running app.
- [`05_ISR/Get_Set_Up/`](05_ISR/Get_Set_Up/) — an unbuilt screen, showing what an honest
  empty facet looks like.

## 6. Related

- [`law/DECISIONS.md`](../law/DECISIONS.md) — ADR-020, ADR-021, ADR-022.
- [`requirements/KNOWLEDGE-LIBRARY.md`](../requirements/KNOWLEDGE-LIBRARY.md) — the three
  layers, the Perception Library, the eight container facets.
- [`work/OPEN-ITEMS.md`](../work/OPEN-ITEMS.md) — where this book's gaps are tracked.
