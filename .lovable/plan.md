## Plan: Implement Variant B — "The Human Blockchain"

### Goal
Swap the public-facing label from "Quantum Dashboard" to "The Human Blockchain," and strip the brand/company names from the anonymous view while preserving the vertical structure and generic descriptions.

### What will change
1. **Header label**
   - Rename the dropdown trigger from "Quantum Dashboard" to "The Human Blockchain".
   - Keep the same dropdown behavior and placement.

2. **Public dropdown content**
   - Remove brand/legal names: "United Stakeholders", "Market Applications", "Buddy Claim", "SelfInsurity", "ClaimStore", "RRCA", "Kimosabe".
   - Display only the seven vertical labels: Foundation, Tech, Legal, Insurance, Banking, Construction, Center.
   - Keep the existing generic one-line descriptions under each vertical.

3. **Routes and pages**
   - Public brand routes (`/b/<slug>`) remain reachable, but the switcher no longer advertises the brand names to anonymous users.
   - The `/architecture` page copy is reviewed; any "Quantum Dashboard" references are updated to "The Human Blockchain".

4. **Authenticated experience**
   - No change to the authenticated dashboard or any logged-in views that already expose brand names.

### What will NOT change
- The underlying brand registry (`src/content/brands.ts`) stays intact for authenticated use.
- The seven `/b/<slug>` routes and their brand-scoped styling remain.
- The "1 protocol · 17 roles · 3,350 counties" footer badge remains.

### Acceptance criteria
- An anonymous visitor sees "The Human Blockchain" in the header.
- Opening the switcher shows only vertical labels + generic descriptions, no brand names.
- Authenticated users retain full brand navigation.
- No broken links or routes.

### Next step
Once you approve this plan, I'll implement it. C & D variants stay on hold until you're ready.