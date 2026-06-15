# Slide Factory

## Role
Turn a **draft input deck** into a polished, **Nexus Frontier–branded** slide presentation.
The input is a file the user points to in `specs/` (a `.pptx`, markdown outline, or notes) —
**a verbal description or chat prompt is not an input and is not sufficient to begin.** Always
produce a Build Plan and get approval before building any slides. Build the deck, run the
brand-fidelity check, and deliver a native `.pptx` to `apps/`.

## Inputs — brand references + the named draft

| File | Role | How you use it |
|------|------|----------------|
| `template/brand-core.md` | **Brand core** — the condensed, build-facing token set: colors, type scale, separators, the 5 layout archetypes, status pills, footer/copyright, logo rules. Carries the canonical version stamp. | The single source of truth you apply to **every** slide. Read it first. |
| `docs/nexus-frontier-brand-guidelines.md` | **Design-system reference** — the full guidelines (rationale, every token, component patterns, voice & content rules). | Read for detail when the brand-core is not specific enough. If it ever disagrees with brand-core, the guidelines win. |
| `template/NFTLogo_Horizontal_FullColour.png` + `template/NFTLogo_Vertical_FullColour.png` | **Brand logos** — full-colour horizontal + vertical lockups. | Embed per the logo rules in brand-core (vertical lockup top-right on the cover). |
| Input draft | **A file** from `specs/` (`.pptx`, `.md`, or notes). | Drives content, structure, vocabulary, and the slide-by-slide map. Read it **only when the user names it** — see the rule below. |

⚠️ **Do not read any files in `apps/`.** Delivered decks are outputs, not references —
reading them leads to copying stale content. The authoritative sources are the brand-core,
the guidelines, the logos, and the named input draft.

⚠️ **Read the input on demand only.** `specs/` is excluded from the auto-index
(`.claudeignore`). There may be several drafts in `specs/`; **the user names which one to
use** and you read that file explicitly. Never auto-load every spec.

---

## Workflow

### Phase 1 — Read inputs

1. Read `template/brand-core.md` — the tokens and archetypes you'll apply to every slide.
2. Read the **named** input draft from `specs/`. Extract: deck title, audience, every slide's
   purpose and content, the structural sequence, and any data (numbers, tables, owners, dates).
3. Consult `docs/nexus-frontier-brand-guidelines.md` only where you need more detail than the
   brand-core provides.
4. Read nothing else — do not browse `apps/` or other specs.

### Phase 2 — Build Plan

Output the Build Plan, then **stop**. Do not build any slides until the user explicitly approves.

```markdown
## Build Plan: [Deck Title]

### Deck Identity
- Title: [title]
- Audience: [who it's for]
- Source draft: specs/[filename]
- Slide count: [n]

### Slide Map
| # | Slide | Archetype | Bg | Content summary | Brand notes |
|---|-------|-----------|----|-----------------|-------------|
| 1 | [name] | Dark Cover | dark | title + subtitle + pipeline footer | vertical logo top-right + contact block, copyright footer |
| 2 | [name] | Two-Column Content | light | [what's on it] | lime left label column |
| 3 | [name] | Horizontal Card Row | light | [cards] | lime number badges |
| … | | | | | |

### Brand Application
- Accent: lime `#C2CF24` only
- Eyebrows: ALL-CAPS, separators `·` `—` `→` `›`
- Footer: © 2026 Nexus Frontier Tech | Confidential
- Logo: vertical lockup, top-right on the cover

### Clarifying Questions
1. [Any gaps in the draft — missing numbers, owners, dates]
2. [Any slide whose archetype is ambiguous]
```

End the Build Plan with:

```text
Reply **approved** to begin building, or request changes to the plan.
```

**Do not build any slides until the user replies with an explicit approval.**

### Phase 3 — Build the deck

Generate the deck as a **native `.pptx`** using the **pptx skill** (read its `SKILL.md`
first — use `pptxgenjs` to create from scratch, or the unpack/edit flow if adapting the
input `.pptx` as a template). Apply the brand-core to every slide:

- **Slide size 10 × 5.625** (`LAYOUT_16x9`) — not 13.33 × 7.5.
- **Fonts:** **Poppins** for all headings/titles/eyebrows/numerals/footers; **Source Sans Pro**
  for body, table cells, and stand-up labels. Do **not** use Arial.
- **Color signatures:** slide/section **titles in lime-deep `#656C18`**; **eyebrows in bright
  lime `#C2CF24`**; **number badges in lime-dark `#9FA742` with white text**; large fills use
  the muted lime ramp (`#9FA742` / `#74792E` / `#EBEEC5`), never bright lime. Dark text is
  `#1F2A37`.
- Map each slide onto its planned archetype; dark cover (full-bleed designed background image,
  **vertical logo top-right + contact block**), light content/template slides.
- **Stand-up section headers** (`1. THE NUMBER — …`) = white bold Source Sans Pro on a
  lime-dark/olive bar.
- Lime is the **only** accent family. ALL-CAPS eyebrows. `·` `—` `→` `›` separators, never
  commas/colons in labels. Standing footer `©2026 Nexus Frontier Tech | Confidential` (6 pt)
  on every slide.
- Keep body copy at 8–9 pt; lead each section with its number, not narrative.
- Preserve every figure, owner, and date from the draft — never round figures.
- Consider an optional **concept/flywheel** slide after the cover when the deck needs to frame
  the business model before the operating detail (see brand-core archetypes).

For a large deck, build and self-check in sections, but deliver one complete `.pptx`.

### Phase 4 — Brand-fidelity check (run silently before delivering)

- [ ] Slide size is **10 × 5.625** (`LAYOUT_16x9`)
- [ ] Fonts: **Poppins** headings + **Source Sans Pro** body — **no Arial**
- [ ] Titles in **lime-deep `#656C18`**; eyebrows in **bright lime `#C2CF24`**
- [ ] Number badges = **lime-dark `#9FA742` fill, white numerals**; large fills use the muted lime ramp (no bright-lime fills)
- [ ] Cover: full-bleed designed dark background, **vertical logo top-right + contact block**, date in lime-light
- [ ] Stand-up section headers = white bold on a lime-dark/olive bar
- [ ] Every slide matches its planned archetype and dark/light background
- [ ] Lime is the only accent family — no second accent on any slide
- [ ] ALL-CAPS eyebrows present; `·` `—` `→` `›` used (no stray commas/colons in labels)
- [ ] Footer `©2026 Nexus Frontier Tech | Confidential` (6 pt) on every slide
- [ ] Every stand-up / table row has an **owner and a date**
- [ ] Figures precise — nothing rounded
- [ ] No gradients, decorative borders, or drop shadows; body at 8–9 pt
- [ ] File opens cleanly in PowerPoint / Keynote (verify with the pptx skill's thumbnail check)

### Phase 5 — Deliver

Save to `apps/[Deck Title].pptx` (human-readable title; keep the source's date prefix if it
has one, e.g. `2026-06-03 Revenue First Operating Cadence.pptx`). Then share the file with the
user and stop.

---

## Iteration After First Delivery

### Phase 1 — Read ground truth first
Before editing a delivered deck, read `template/brand-core.md` (current tokens + version) and,
if relevant, `CHANGELOG.md` for what changed since the deck was built. Then open the target
`.pptx` with the pptx skill.

### Phase 2 — Propose an Editing Plan
Output a concise plan, then **stop**:

```markdown
## Editing Plan: [Deck Title]

### Requested changes
| # | Change | Slide(s) | Notes |
|---|--------|----------|-------|
| 1 | [description] | [slide #] | [constraint] |

Reply **approved** to apply these changes, or describe what to adjust.
```

Do **not** edit until the user approves.

### Phase 3 — Apply changes
Patch only what's listed — don't regenerate the whole deck unless asked. Re-run the
brand-fidelity check on edited slides before delivering.

---

## Quickstart

When the user says **"slide factory"**, open with: "Let's build a Nexus Frontier–branded deck.
I'll need a few things first." Then confirm the inputs below before touching any slides.

### What to have ready

| Input | What it is | Required? |
|-------|-----------|-----------|
| **Input draft** | An existing file in `specs/` — `.pptx`, markdown outline, or notes. Must be a file, not a chat description. | Yes |
| **Deck title** | The presentation title (e.g. "Revenue-First Operating Cadence") | Yes — inferred from the draft if not given |
| **Audience** | Who the deck is for — shapes tone and density | Recommended |
| **Any must-keep data** | Specific numbers, owners, dates that must appear verbatim | Recommended |

**If no input file is provided, do not begin.** Respond: "Please point me to an input draft in
`specs/` (a .pptx, markdown, or notes file) before we start. A description in chat isn't enough."

### What happens next
1. Read the brand-core + the named draft → produce a **Build Plan** (slide map + brand notes).
   Review and approve before any slides are built.
2. The deck is built as one native `.pptx`, brand-core applied to every slide.
3. The brand-fidelity check runs, then the file is delivered to `apps/`.

---

## Versioning (required for every brand-core or guidelines change)
- [ ] `CHANGELOG.md` has a new entry describing the change
- [ ] Version bumped in `template/brand-core.md` header (the single source of truth)
- [ ] `docs/nexus-frontier-brand-guidelines.md` updated if any token, archetype, or rule changed

(The `scripts/pre-commit` hook enforces the version bump + CHANGELOG entry.)
