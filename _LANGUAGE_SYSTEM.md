# PackFitter Language System

**Layer:** Linguistic rules (sits beneath `_BLUEPRINTS.md`)
**Scope:** Trip pages + Airline pages
**Purpose:** Make AI-assisted page generation scalable without producing duplicate-quality pages.

This document does not define page structure — that is the Blueprint's job. This document defines *how sentences and paragraphs are built* inside each blueprint slot so that 30+ pages can share a skeleton without sharing a voice.

---

## A. Purpose of the Language System

The Blueprint System guarantees that every page has the right sections in the right order. The Language System guarantees that every page *reads like it was written for that specific trip length or that specific airline* — not like a mail merge.

This system exists to solve six specific failure modes observed in AI-generated programmatic SEO content:

1. **Mail-merged feel** — the same paragraph with a different noun dropped in.
2. **Repeated sentence openings** — every page starts "Packing for a [N]-day trip..."
3. **Noun-swapped paragraphs** — "Delta" → "United" with nothing else changing.
4. **Generic SEO filler** — paragraphs that could appear on any travel blog.
5. **Unsafe overclaims** — "will fit" / "guaranteed" / "always works."
6. **Unwarranted equal confidence** — an EasyJet 40L page sounding as certain as a Delta 35L page.

Every rule below exists to prevent one or more of those failures.

---

## B. Global Language Rules

These rules apply to every page regardless of type.

**B1. Answer first, always.**
The first sentence of the Hero, Answer Box, or lead paragraph must contain the quantified answer (liters, days, or fit verdict). No throat-clearing. No "In this guide..." openers.

**B2. Every paragraph earns its place with one of three things.**
A paragraph must contain at least one of:
(a) a number or range (e.g., "22–28L", "5–7 days", "35L"),
(b) a specific constraint (e.g., "sizer box", "personal item only", "no laundry"),
(c) a comparison (e.g., "tighter than Delta's", "closer to EasyJet's limit").
A paragraph with none of those is filler and must be cut or rewritten.

**B3. Legal-safe verbs only.**
Allowed: *typically fits, generally works, usually accommodates, tends to handle, commonly passes, sits within, stays under.*
Banned: *will fit, guaranteed, always, never fails, certain to pass, definitely.*

**B4. Brand names appear exactly once per section — then pronoun or category noun.**
First mention: "Delta Air Lines" or "Delta." Subsequent mentions in the same section: "the airline," "this carrier," or "they." This prevents the keyword-stuffed feel of "Delta Delta Delta."

**B5. No adjectives without a measurement attached.**
Banned when standing alone: *spacious, roomy, compact, generous, tight, tiny.*
Allowed when paired: *spacious for a 35L, tight for anything over 5 days, compact enough to sit under the seat.*

**B6. One idea per sentence.**
If a sentence has two commas and an "and," split it.

**B7. Second person sparingly.**
"You" is allowed but not in every sentence. Mix with imperative ("Pack light layers...") and descriptive ("A 35L bag handles...") to avoid the "you, you, you" drumbeat.

**B8. No emoji. No exclamation marks.** PackFitter voice is calm, specific, and slightly dry.

---

## C. Trip Page Language System

Trip pages are organized around *duration* as the primary variable. The reader came in knowing their trip length and wants to know what fits and what to pack.

### C1. Tone for trip pages
Practical, reassuring, slightly technical. The reader is planning — they want confidence without hype.

### C2. Required specificity per trip page
Every trip page must reference, by name, at least:
- the day count (e.g., "14 days"),
- a liter range (e.g., "38–45L"),
- one laundry assumption ("with mid-trip laundry" / "without laundry"),
- one climate caveat ("temperate" / "mixed" / "cold-weather").

### C3. Forbidden openings for trip pages
- "Packing for a [N]-day trip can be tricky..."
- "When you're going away for [N] days..."
- "A [N]-day trip is the perfect length to..."
- "Planning a [N]-day trip?"
These are banned because they appeared on every early draft.

### C4. Required variation across the trip set
Across the 5 trip pages (3/5/7/10/14), no two Hero openings may share their first five words, and no two Bottom Line sections may use the same lead bullet structure.

---

## D. Airline Page Language System

Airline pages are organized around *fit verdict* as the primary variable. The reader came in knowing their airline and bag size and wants a yes/no answer.

### D1. Tone for airline pages
Direct, verdict-first, fact-checked. The reader is anxious about gate-checking — they want a clean answer and the reasoning.

### D2. Required specificity per airline page
Every airline page must reference, by name, at least:
- the airline (once, in full, in the Answer Box),
- the exact bag liter size,
- the airline's published linear inches or cm limit,
- one fit driver (sizer box, personal item rules, overhead policy, enforcement reputation),
- a confidence level (high / moderate / tight / not recommended).

### D3. Confidence wording is not interchangeable
The Confidence chip must match the Answer Box verdict. The language system enforces four distinct confidence tiers:

- **High confidence** → "fits comfortably within," "well under the limit," "routinely passes."
- **Moderate confidence** → "typically fits within," "generally works for," "sits inside the limit."
- **Tight fit** → "sits right at the limit," "leaves little margin," "depends on how it's packed."
- **Not recommended** → "exceeds the published limit," "not a safe choice for," "likely to be gate-checked."

A 35L bag on Delta is never written with the same verb as a 45L bag on EasyJet. The Language System forbids cross-tier language reuse.

### D4. Forbidden openings for airline pages
- "Flying [AIRLINE] with a [N]L bag?"
- "Planning to fly [AIRLINE]?"
- "Wondering if your [N]L bag will fit on [AIRLINE]?"
- "[AIRLINE] has specific carry-on rules..."
These are banned because they produce mail-merged output.

### D5. Required variation across the airline set
Across all 30 airline pages (6 airlines × 5 sizes), no two pages may share the same Answer Box sentence structure, and no two pages for the same bag size may share the same Hero opening.

---

## E. Section-by-Section Variation Framework

For each blueprint slot below, the AI must pick from the associated pattern pool (Section F) rather than writing freehand. This is the core of the system: structured variety, not structured sameness.

### E1. Trip pages

| Blueprint slot | Pattern pool to use | Rotation rule |
|---|---|---|
| Hero intro | `HERO_TRIP` | Pick a different pattern than the adjacent trip-length pages |
| Packing list lead-in | `PACKING_LIST_LEAD` | Rotate by trip length |
| Trip variations paragraph | `VARIATIONS_COMPARISON` | Must contrast this trip with a neighboring length |
| Volume paragraph | `VOLUME_CALC` | Must cite the liter range |
| Constraints paragraph | `CONSTRAINTS_TRIP` | Must name at least one hard constraint |
| Strategy paragraph | `STRATEGY_FRAMING` | Pick a different framing than neighbors |
| Bag size recommendation | `BAG_SIZE_REC` | Must match calculator default |
| Bottom line bullets | `BOTTOM_LINE_TRIP` | Lead bullet must not repeat across trip set |

### E2. Airline pages

| Blueprint slot | Pattern pool to use | Rotation rule |
|---|---|---|
| Answer box | `ANSWER_BOX` | Tier must match confidence |
| Hero note | `HERO_AIRLINE` | Pick different pattern per (airline, size) combo |
| Quick Breakdown — Works Well | `BREAKDOWN_WORKS` | Must reference days, climate, laundry |
| Quick Breakdown — Tight Fit | `BREAKDOWN_TIGHT` | Must reference a concrete driver |
| Airline Rules footnote | `AIRLINE_FOOTNOTE` | Must cite the published limit |
| Confidence chip | `CONFIDENCE_CHIP` | Tier-locked — see D3 |
| Bottom line bullets | `BOTTOM_LINE_AIRLINE` | Lead bullet must not repeat across airline set |
| Internal-link anchors | `INTERNAL_LINK_ANCHOR` | Must vary across pages |
| CTA | `CTA_RECALL` | Must reference the calculator by function, not name |

---

## F. Sentence Pattern Pools

Notation:
`[N]` = number, `[RANGE]` = liter or day range, `[AIRLINE]` = airline name, `[SIZE]` = bag liters, `[DRIVER]` = specific constraint (sizer, overhead, personal item), `[CLIMATE]` = climate word, `[DAYS]` = trip length, `[VERB_TIER]` = verb from the confidence tier in D3.

### F1. HERO_TRIP (trip page hero opening)

Pattern A — *Range-led:*
> A [DAYS]-day trip typically needs [RANGE]L of bag space, depending on climate and laundry access.

Pattern B — *Constraint-led:*
> With mid-trip laundry, a [DAYS]-day trip stays inside [SIZE]L. Without it, plan for closer to [RANGE]L.

Pattern C — *Comparison-led:*
> A [DAYS]-day trip sits between a [DAYS-2]-day weekend and a full two-week haul — which means the packing math is different from both.

Pattern D — *Verdict-led:*
> Most [DAYS]-day trips fit into a single carry-on. The exception is cold weather without laundry.

Pattern E — *Driver-led:*
> The real variable on a [DAYS]-day trip isn't clothes — it's shoes, layers, and whether laundry is available.

### F2. VOLUME_CALC (volume paragraph inside trip pages)

Pattern A:
> Based on typical packing, a [DAYS]-day trip works out to [RANGE]L once layers and a pair of shoes are accounted for.

Pattern B:
> The calculator lands near [SIZE]L for a [DAYS]-day temperate trip with laundry, and closer to [RANGE_HIGH]L without it.

Pattern C:
> Running the math for [DAYS] days of [CLIMATE] clothing puts most travelers in the [RANGE]L band.

### F3. VARIATIONS_COMPARISON (trip variations paragraph)

Pattern A — *Step up:*
> A [DAYS]-day trip needs noticeably more than a [DAYS-2]-day trip — mostly because an extra pair of pants and a second set of layers add up quickly.

Pattern B — *Step down:*
> Compared to a [DAYS+4]-day trip, a [DAYS]-day trip lets you skip the laundry detour and pack heavier items without penalty.

Pattern C — *Driver swap:*
> The difference between [DAYS] days and [DAYS+2] days isn't the shirts — it's whether you need a second pair of shoes.

### F4. CONSTRAINTS_TRIP (constraints paragraph)

Pattern A:
> Two things tighten the math on a [DAYS]-day trip: cold weather and no laundry. Either one alone is manageable. Both together push most travelers to a larger bag.

Pattern B:
> The hard constraint is [DRIVER]. Once that's set, every other choice — bag size, packing style, shoe count — follows from it.

Pattern C:
> Plan around the single largest item in the bag. On a [DAYS]-day trip, that's usually shoes or a jacket, not clothing volume.

### F5. STRATEGY_FRAMING (strategy paragraph)

Pattern A — *Minimalist framing:*
> Pack the shortest trip that honestly fits your plans, then add one layer buffer. Overpacking is the default mistake on [DAYS]-day trips.

Pattern B — *Modular framing:*
> Build the kit in three layers: core clothing, weather layer, and a compression buffer for laundry day.

Pattern C — *Anchor framing:*
> Start with the bag size and work backward. A [SIZE]L bag forces honest decisions that a [SIZE+10]L bag would let you avoid.

### F6. BAG_SIZE_REC (bag size recommendation)

Pattern A:
> For a [DAYS]-day trip in temperate weather with laundry, a [SIZE]L bag typically fits the full kit.

Pattern B:
> A [SIZE]L bag is the honest answer for most [DAYS]-day trips. Go smaller if you're ruthless about laundry. Go larger only for cold weather.

Pattern C:
> The sweet spot for a [DAYS]-day trip sits at [SIZE]L — enough room for layers, not so much that overpacking becomes free.

### F7. BOTTOM_LINE_TRIP (trip page bottom line bullets)

Lead-bullet patterns (first bullet must not repeat across trip set):

- "A [SIZE]L bag covers a [DAYS]-day trip in most conditions."
- "Laundry access is worth roughly [N]L of bag space."
- "Cold weather adds [N]–[N]L to the honest total."
- "Shoes are the single largest packing variable on a [DAYS]-day trip."
- "The difference between [DAYS] and [DAYS+2] days is one pair of pants and one layer."

### F8. ANSWER_BOX (airline page answer box)

Pattern A — *High confidence:*
> A [SIZE]L backpack [VERB_TIER:high] [AIRLINE]'s carry-on limit of [LIMIT].

Pattern B — *Moderate:*
> A [SIZE]L backpack [VERB_TIER:moderate] [AIRLINE]'s published carry-on limit, with some margin depending on how it's packed.

Pattern C — *Tight:*
> A [SIZE]L backpack [VERB_TIER:tight] [AIRLINE]'s carry-on limit. It can work, but leaves little room for bulging or overstuffing.

Pattern D — *Not recommended:*
> A [SIZE]L bag [VERB_TIER:not_recommended] [AIRLINE]'s published carry-on limit. A smaller bag is the safer choice.

### F9. HERO_AIRLINE (airline page hero note)

Pattern A — *Enforcement-led:*
> [AIRLINE] enforces [DRIVER] more strictly than most US carriers, which makes the [SIZE]L math matter more than the number on the bag's spec sheet.

Pattern B — *Spec-led:*
> [AIRLINE]'s carry-on limit is [LIMIT]. A [SIZE]L bag [VERB_TIER] those dimensions depending on its shape.

Pattern C — *Comparison-led:*
> Compared to US legacy carriers, [AIRLINE]'s limit is [tighter/looser]. That shifts the honest verdict for a [SIZE]L bag.

### F10. BREAKDOWN_WORKS (Quick Breakdown — Works Well bullets)

Must include at least one of each: days, climate, laundry, packing style.

Examples (rotate structure across pages):
- "[DAYS_RANGE] day trips"
- "[CLIMATE] or warm climate"
- "Laundry available mid-trip"
- "Light to standard packing"
- "No extra shoes packed"
- "No bulky winter gear"

### F11. BREAKDOWN_TIGHT (Quick Breakdown — Tight Fit bullets)

Must reference a concrete driver, not a vague feeling.

Examples:
- "Cold weather packing"
- "Heavy packing style"
- "Extra shoes in the bag"
- "Laptop and full tech kit"
- "No laundry, longer trip"
- "Larger clothing sizes"

### F12. AIRLINE_FOOTNOTE (Airline Rules footnote)

Pattern A:
> [AIRLINE] publishes a carry-on limit of [LIMIT]. Personal items must fit under the seat. Rules current as of the page's last review date.

Pattern B:
> The published carry-on limit for [AIRLINE] is [LIMIT]. [DRIVER] is the most commonly cited enforcement point. Always confirm before travel.

Pattern C:
> [AIRLINE]'s stated carry-on dimensions are [LIMIT]. Bags are measured against [DRIVER] at the gate when enforcement is active.

### F13. CONFIDENCE_CHIP (tier-locked)

- **High:** "Fits comfortably" / "Well under the limit" / "Routinely passes"
- **Moderate:** "Typically fits" / "Generally works" / "Sits inside the limit"
- **Tight:** "Right at the limit" / "Little margin" / "Depends on the pack"
- **Not recommended:** "Exceeds the limit" / "Likely gate-check" / "Not a safe choice"

The chip text and the Answer Box verb must share the same tier. Mixing is a reject.

### F14. BOTTOM_LINE_AIRLINE (airline page bottom line bullets)

Lead-bullet patterns:

- "A [SIZE]L bag [VERB_TIER] [AIRLINE]'s published limit."
- "[DRIVER] is the main enforcement point to watch."
- "Compared to [OTHER_AIRLINE], [AIRLINE]'s limit is [tighter/looser] by [N] inches."
- "A [SIZE-5]L bag is the safer choice if you expect [DRIVER] enforcement."
- "Pack style matters more than bag spec on [AIRLINE]."

### F15. INTERNAL_LINK_ANCHOR

Anchors must vary, not repeat. Rotate from:
- "What to pack for a [DAYS]-day trip →"
- "See the [DAYS]-day packing breakdown →"
- "[DAYS]-day trip packing list →"
- "How much fits in a [SIZE]L bag →"
- "[AIRLINE] carry-on rules explained →"

### F16. CTA_RECALL

The CTA refers to the calculator by *function*, not product name.

Patterns:
- "Run your own numbers above."
- "Adjust the calculator to match your trip."
- "Re-run the fit check with your actual bag."
- "Change the inputs to match your packing style."

---

## G. Paragraph Construction Rules

**G1. Three-beat paragraph.**
Every body paragraph follows: *claim → number or constraint → implication.* If any beat is missing, the paragraph is filler.

Example of compliant:
> A 14-day trip typically needs 38–45L of bag space. Cold weather adds another 5–8L because of layers and a second pair of shoes. That pushes most cold-weather two-week trips out of standard carry-on territory.

Example of non-compliant (missing number):
> A 14-day trip needs a fair amount of space. You'll want to pack carefully and think about what you really need. Most people bring too much.

**G2. No two consecutive paragraphs may start with the same word.**
If paragraph N starts with "A," paragraph N+1 cannot start with "A."

**G3. No paragraph over 4 sentences.**
Long paragraphs signal filler. Break them.

**G4. No paragraph under 2 sentences unless it's a deliberate verdict.**
One-sentence paragraphs are reserved for Answer Box and Bottom Line bullets.

**G5. Numbers must be real, not decorative.**
Every number in the copy must trace back to either the calculator output, the airline's published spec, or the Blueprint's documented ranges. No invented stats.

**G6. Paragraphs must differ in length.**
A page where every paragraph is exactly three sentences long reads mechanically. Vary 2, 3, 4.

**G7. Comparisons are load-bearing.**
At least one paragraph per page must compare this page's subject to a neighbor (another trip length, another airline, another bag size). Comparisons are the single strongest signal that a page was written for *its* topic, not mass-produced.

---

## H. Anti-Duplication Safeguards

**H1. First-five-words rule.**
No two pages of the same type (trip or airline) may share their first five words in the Hero.

**H2. Noun-swap detection.**
If you can replace "Delta" with "United" in a paragraph and the paragraph still reads correctly, the paragraph is a noun-swap and must be rewritten. The fix: add something that only applies to *this* airline (enforcement reputation, published limit in exact numbers, sizer box behavior, personal item policy).

**H3. Sentence-opening diversity.**
Across a single page, sentence openings must include at least four of: *A, The, With, Most, For, Pack, Run, Compared, Plan.* Using the same opener more than twice in a page is a reject.

**H4. Confidence tier lock.**
Language from a higher confidence tier may not appear on a page locked to a lower tier. A "tight fit" page cannot use "fits comfortably" anywhere, even in a subordinate clause.

**H5. Bullet-lead rotation.**
The lead bullet of Bottom Line must be unique across the whole page set of that type. Track which lead bullets have been used.

**H6. No cross-page copy-paste.**
If a paragraph appears verbatim on two pages, one of them is wrong. Paragraphs may share *structure* (that's what the pattern pools are for) but not *text.*

---

## I. Acceptable Reuse vs Unacceptable Repetition

**Acceptable — shared structure, different substance:**

Page A (Delta 35L):
> A 35L backpack fits comfortably within Delta's carry-on limit of 22 × 14 × 9 inches. Delta enforces overhead space loosely in most cases, which makes a 35L bag a low-anxiety choice for domestic routes.

Page B (EasyJet 35L):
> A 35L backpack sits right at EasyJet's cabin-bag limit of 45 × 36 × 20 cm. EasyJet enforces the sizer box strictly at European gates, which makes a 35L bag a borderline choice rather than a comfortable one.

Both pages use the same skeleton (answer verb + limit + enforcement + verdict), but every filled slot differs — including the confidence tier, the limit, the enforcement driver, and the verdict noun. This is the target.

**Unacceptable — noun swap:**

Page A:
> Flying Delta with a 35L bag? You'll be happy to know that a 35L backpack typically fits Delta's carry-on rules without any issues. Delta has specific carry-on rules, but most modern 35L bags meet them.

Page B:
> Flying United with a 35L bag? You'll be happy to know that a 35L backpack typically fits United's carry-on rules without any issues. United has specific carry-on rules, but most modern 35L bags meet them.

This is a reject: the paragraphs are identical except for the airline name, use a banned opening ("Flying [AIRLINE] with..."), contain no numbers, and make no distinction between airlines with meaningfully different enforcement.

**Acceptable — tier-matched confidence:**

Delta 35L (high): *"A 35L backpack fits comfortably within Delta's 22 × 14 × 9 limit."*
EasyJet 45L (not recommended): *"A 45L backpack exceeds EasyJet's 45 × 36 × 20 cabin-bag limit and is likely to be gate-checked."*

**Unacceptable — tier mismatch:**

EasyJet 45L written as: *"A 45L backpack typically fits EasyJet's limit."*
This overclaims. The honest tier is "not recommended," and the verb must match.

---

## J. Human Review Checklist

Before any AI-generated page is accepted, a human reviewer runs this checklist. A page fails if any item is a *no.*

**Structural gates (Blueprint layer):**
- [ ] All required sections present in the blueprint order.
- [ ] Calculator present and set to auto-fire on load.
- [ ] Internal links to sibling pages present and use root-relative paths.

**Calculator alignment gates:**
- [ ] Liter ranges in the copy match calculator output within ±2L.
- [ ] Default bag size in the copy matches `PAGE_DEFAULT_BAG_SIZE`.
- [ ] Laundry assumption in the copy matches `PAGE_DEFAULT_LAUNDRY`.
- [ ] Airline name in the copy matches `PAGE_DEFAULT_AIRLINE` (airline pages only).

**Legal-safety gates:**
- [ ] No banned verbs (*will fit, guaranteed, always, never, certain*).
- [ ] Confidence chip tier matches Answer Box tier.
- [ ] All cited airline limits are the published figures.

**Variation gates:**
- [ ] Hero opening is not in the forbidden-openings list (C3 or D4).
- [ ] First five words of the Hero are not shared with any sibling page.
- [ ] No paragraph is a noun-swap of a paragraph on a sibling page.
- [ ] Sentence openings within the page use at least four different starters.
- [ ] Lead bullet of Bottom Line is not reused across sibling pages.

**Depth gates:**
- [ ] Every paragraph contains a number, a specific constraint, or a comparison.
- [ ] At least one paragraph compares this page's subject to a neighbor.
- [ ] No standalone adjectives without a measurement attached.
- [ ] No paragraph exceeds four sentences.

**Quality gates:**
- [ ] Page reads like it was written for this specific trip or airline.
- [ ] The Answer Box gives a clean verdict in the first sentence.
- [ ] Removing the page's main noun (trip length or airline) would break the copy, not just change a label.

If a page passes all gates, it is accepted. If it fails any gate, the failing section is regenerated against the relevant pattern pool, not rewritten freehand.

---

**End of PackFitter Language System.**
This document pairs with `_BLUEPRINTS.md`. Blueprint governs structure. Language System governs voice.
