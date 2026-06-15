# Nexus Frontier Tech — Brand & Design System Guidelines
*Extracted from "Revenue-First Operating Cadence" deck, June 2026*

---

## 1. Brand Identity

**Company:** Nexus Frontier Tech
**Products:** OneNexus platform, AI Workers
**Tagline register:** Functional, revenue-first, zero fluff. ("Lead with the number.")
**Websites:** www.nexusfrontier.tech · www.onenexus.ai
**Copyright line:** © 2026 Nexus Frontier Tech | Confidential

---

## 2. Color System

### Primary Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-lime-primary` | `#C2CF24` | Primary accent — section labels, highlight bars, key numbers |
| `--color-lime-light` | `#C8D253` | Lighter lime variant — borders, subtle fills |
| `--color-lime-dark` | `#9FA742` | Darker lime — secondary labels, active states |
| `--color-lime-deep` | `#656C18` | Deep lime — text on lime backgrounds |
| `--color-lime-muted` | `#A8B563` | Muted lime — supplementary labels |
| `--color-black` | `#000000` | Master background (dark slides), body text |
| `--color-white` | `#FFFFFF` | Light slide backgrounds, reversed text |
| `--color-near-white` | `#EEEEEE` | Subtle surface fills |

### Neutral Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-charcoal` | `#212121` | Primary dark text on light backgrounds |
| `--color-slate` | `#595959` | Secondary text, captions |
| `--color-slate-mid` | `#5B6675` | Table labels, metadata text |
| `--color-steel` | `#78909C` | Tertiary / de-emphasized text |
| `--color-divider` | `#D5D5D5` | Divider lines, borders |
| `--color-surface-light` | `#F3F3F3` | Card / panel backgrounds |
| `--color-surface-blue` | `#F4F6F9` | Alternate surface (pipeline rows) |
| `--color-border-light` | `#DCE3EA` | Light border on cards |
| `--color-smoke` | `#E9E9E9` | Table row alternates |
| `--color-off-white-warm` | `#E5E7DC` | Warm neutral fills |

### Status Colors

| Token | Hex | Meaning |
|-------|-----|---------|
| `--color-status-green` | `#0F8A60` | On track |
| `--color-status-amber` | `#C08A2E` | Watch / caution |
| `--color-status-red` | `#B23B3B` | At risk |
| `--color-status-blue` | `#4285F4` | Theme accent / links |
| `--color-teal` | `#0097A7` | Hyperlinks, active nav |

### Data / Chart Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-chart-blue` | `#7EB8F5` | NCU / platform data |
| `--color-chart-green` | `#1D9E75` | Positive / growth |
| `--color-chart-red` | `#E24B4A` | Risk / negative |
| `--color-chart-amber` | `#EF9F27` | Revenue / financial |
| `--color-chart-lime` | `#BFD146` | Chart lime (fills) |

### Slide Background Mapping

| Slide type | Background | Text |
|------------|------------|------|
| Title / section cover | Black (`#000000`) | White + lime accents |
| Content / template | White (`#FFFFFF`) | Charcoal + lime accents |
| Flywheel / diagram | Black or dark navy | White |

---

## 3. Typography

### Typeface

The deck uses a **two-typeface system** (confirmed from the embedded fonts in the reference deck):

**Headings font:** `Poppins` — titles, section headings, eyebrows, numerals, the pipeline chain,
cover, and footers. Weights in use: `Poppins Medium`, `Poppins SemiBold`, `Poppins Light`.
**Body font:** `Source Sans Pro` — descriptions, table cells, stand-up section labels and copy.

**Fallback stacks:** headings `Poppins, Montserrat, Arial, sans-serif`; body
`Source Sans Pro, "Segoe UI", Arial, sans-serif`.

*(An earlier version of this guide guessed Arial because the font was not detected at extraction
time. The actual deck embeds Poppins + Source Sans Pro — use those.)*

### Type Scale

| Level | Size | Font / Weight | Color | Usage |
|-------|------|---------------|-------|-------|
| Cover Hero Title | 22 pt | Poppins Medium | White | Title on cover |
| Cover Subtitle | 18 pt | Poppins Light | White | Cover subtitle |
| Section / Slide Title | 21 pt | Poppins Medium | **Lime-deep `#656C18`** | Content-slide headings |
| Section Intro | 11 pt | Poppins | Lime-deep | Line under the title |
| Stat Callout | 16 pt | Poppins Bold | Lime-deep | Flywheel / KPI callouts |
| Card Header | 14 pt | Source Sans Pro Bold | Ink `#1F2A37` | Frame labels (THE NUMBER…) |
| Card / Segment Title | 13–14 pt | Poppins SemiBold | Ink / White | Pipeline cards |
| Big Numeral (badge) | 20 pt | Poppins Medium | White on lime-dark badge | Step numbers |
| Body | 9 pt | Source Sans Pro | Slate `#595959` | Body copy, descriptions |
| Caption / Meta | 8 pt | Poppins / Source Sans Pro | Slate-mid `#5B6675` | Sub-labels, table meta |
| Eyebrow / Tag | 8 pt | Poppins Medium ALL-CAPS | **Lime `#C2CF24`** | Category labels above sections |
| Page Footer | 6 pt | Poppins Medium | White / Lime-muted `#A8B563` | Copyright line |

### Typographic Rules

- **ALL-CAPS eyebrows** precede section headings (e.g. `THE STAND-UP FRAME`, `NEUS FRONTIER TECH · CONFIDENTIAL`)
- **Middle-dot separator** `·` is used instead of commas in labels and tags
- **Em-dash separator** `—` marks label/value pairs (e.g. `THE NUMBER — booked revenue today`)
- **Right-arrow `→`** indicates assigned owner + deadline
- **Left-angle bracket `›`** used as flow connector in pipeline chains

---

## 4. Layout & Spacing

### Slide Dimensions
Standard 16:9: **10" × 5.625"** (the reference deck's actual size; PptxGenJS `LAYOUT_16x9`).
*(An earlier version of this guide stated 13.33 × 7.5; the delivered deck is 10 × 5.625.)*

### Grid & Margins
- Outer margin: ~0.5" (consistent on all edges)
- Content columns: typically 2-column (label left + value right) or 4-column card grid
- Section padding inside cards: ~0.2–0.3" internal

### Layout Archetypes

**1. Dark Cover Slide**
- Full black background
- Lime accent bar or pipeline chain as a footer element
- Vertical logo top-right, contact block top-right (name · position · email · websites)
- Large bold white title, subtitle in smaller white
- Footer: copyright + date + confidentiality

**2. Two-Column Content Slide**
- White background
- Lime-colored left label column (thin, ~15% width)
- Main content right column (~85%)
- Section number in large muted color (20 pt)
- Section title in 14 pt bold
- Body in 9 pt regular

**3. Horizontal Card Row (Pipeline / Steps)**
- 5-column equal-width cards
- Step number badge (circular, lime background)
- Card title + description + owner label per card
- Cards separated by thin divider lines or spacing
- Alternating surface colors: white and `#F4F6F9`

**4. Four-Frame Grid (The Stand-Up Frame)**
- 2×2 card layout
- Each card: large step number (20 pt, muted), bold frame name (14 pt), description (9 pt)
- Card backgrounds: white with subtle border

**5. Stand-Up Template (Fill-in)**
- Numbered sections with `1.`, `2.`, `3.`, `4.`
- Each section: section header (9 pt ALL-CAPS with em-dash), descriptor row (8 pt), data table
- Status column using color-coded pills: green / amber / red

---

## 5. Components & Patterns

### Status Pill
- Small inline badge
- Text: `On track` / `Watch` / `At risk`
- Background: `#0F8A60` / `#C08A2E` / `#B23B3B`
- Text: White, ~7–8 pt, no border-radius specified (pill shape implied)

### Data Table
Standard stand-up table columns:
```
Deal / Client | Value ($/m) | Prob % | Close by / Due | Action needed | Owner → Date
```
- Header row: 8 pt bold, `#5B6675` or `#8C8C8C`
- Data rows: 8–9 pt regular, alternating white / `#E9E9E9`
- Horizontal dividers only (no vertical lines)

### KPI / Metric Callout
- Large number: 11–14 pt bold (relatively small — not hero numbers)
- Sub-label: 8 pt regular, Slate
- Inline with body text or in a dedicated callout block
- Framing: `today vs target` pattern; percentage gap shown as `XX% to target`

### Pipeline Chain
```
Pipeline  ›  Commitment  ›  Delivery  ›  Invoice  ›  Cash
```
- Right-angle brackets as connectors
- Each segment = team responsibility
- Often shown as a footer bar on dark slides

### Section Number Badge
- Large numeral (20 pt), color `#D5D5D5` (muted) or lime on dark
- Positioned top-left of a card or section block

### Flywheel Diagram
- Circular / radial layout
- Label nodes: abbreviated category names
- Connecting arrows indicate feedback loops
- Background: dark; node fills: lime, teal, amber variants

### Eyebrow / Section Tag
- Small ALL-CAPS label above section (e.g. `ONE CHAIN OF VALUE`)
- Style: `#656C18` or `#9FA742`, 6–8 pt

---

## 6. Iconography

No custom icon set identified. Layout uses:
- **Text symbols** as design elements: `›`, `→`, `—`, `·`, `↑`
- **Circular number badges** for step indicators
- **Color blocks** (not icons) for status signaling

---

## 7. Voice & Content Patterns

### Copy Tone
- Short, declarative, financial-first
- No passive voice. No filler.
- Every section leads with a metric before explanation
- Format: `LABEL — description · owner → deadline`

### Structural Pattern (The Stand-Up Frame)
Every report follows this 4-part sequence — never reordered:
1. **THE NUMBER** — current figure vs. target
2. **THE GAP** — specific delta, named deal/invoice
3. **THE MOVE** — one action, one owner, one deadline
4. **THE BLOCKER** — impediment + who removes it today

### Naming Conventions
- Sections use ALL-CAPS noun phrases (`THE REPORTING STRUCTURE`, `THE COMPOUNDING FLYWHEEL`)
- Template labels use ALL-CAPS + em-dash (`THE NUMBER — booked revenue today`)
- Audience-specific templates are labeled: `STAND-UP TEMPLATE · SALES & BD`

---

## 8. Brand Assets

| Asset | Description |
|-------|-------------|
| Logo (dark bg) | ONX / Nexus Frontier Tech wordmark — white version for black backgrounds |
| Logo (light bg) | Full-color version for white/light backgrounds |
| Favicon / icon | Not extracted from this deck |
| Agent icon | OneNexus AI agent avatar (referenced in platform UI) |

---

## 9. Key Terminology

| Term | Definition |
|------|------------|
| NCU | Nexus Outcome Unit — one completed, quality-assured AI-delivered business outcome |
| AI Worker | Nexus Frontier's product unit (not "chatbot", not "model") |
| Revenue chain | Pipeline → Commitment → Delivery → Invoice → Cash |
| MRR | Monthly Recurring Revenue |
| ARR | Annual Recurring Revenue |
| MTD | Month to Date |
| The Number | Booked/invoiced revenue figure — always the first sentence of any stand-up |

---

## 10. Design Dos & Don'ts

### Do
- Lead every section with a number, not a narrative
- Use lime (`#C2CF24`) as the single primary accent — not blue, not teal
- Use ALL-CAPS eyebrows to introduce sections
- Use `·` and `—` as content separators, not commas or colons
- Apply dark (black) backgrounds to title, section cover, and diagram slides
- Apply white backgrounds to operational / fill-in template slides
- Keep body copy at 9 pt — density is intentional

### Don't
- Use gradients (not present in this deck)
- Mix multiple accent colors on a single slide
- Use decorative borders or drop shadows
- Round numbers up — show precise figures with `/m` suffix
- Use passive language in section headers
- Leave a row without an owner and a date

---

*Spec extracted from: `2026-06-03 Revenue First Operating Cadence.pptx`*
*Extraction date: 2026-06-13*
