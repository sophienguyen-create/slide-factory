# Slide Factory — Brand Core

<!-- Slide Factory brand-core — v1.1.0 — 2026-06-13 -->
<!-- SINGLE SOURCE OF TRUTH for the build-facing brand tokens. -->
<!-- Carries the canonical version stamp (read by scripts/pre-commit). -->
<!-- The full design-system reference lives in docs/nexus-frontier-brand-guidelines.md. -->

This is the condensed, build-facing token set the agent applies to **every** deck. It is
deliberately short — the exhaustive reference (rationale, every status/chart token, voice
rules) is `docs/nexus-frontier-brand-guidelines.md`. When the two ever disagree, the
guidelines doc wins; update this file to match and bump the version below.

---

## Version

`v1.1.0` — bump on any change to tokens, archetypes, or asset rules, and add a matching
`CHANGELOG.md` entry (enforced by `scripts/pre-commit`).

---

## 1. Color tokens

Use **lime as the single accent**, but as a **ramp** — bright lime for thin accents and
eyebrows; muted/dark lime and deep olive for fills (badges, header bars). Never mix a second
accent family on one slide.

| Token | Hex | Use |
|-------|-----|-----|
| Lime primary | `#C2CF24` | Eyebrows (ALL-CAPS tags), thin highlight bars, small accents — **use sparingly** |
| Lime dark | `#9FA742` | **Primary fill** — number badges, header bars, accent blocks (with white text) |
| Olive deep | `#74792E` | Deep accent fills, alternate header bars |
| Lime deep | `#656C18` | **Section/slide titles, intro lines, "company number" callout text** |
| Lime pale | `#EBEEC5` | Subtle tint fills behind blocks |
| Lime light | `#C8D253` | Date stamp on dark cover, light accents |
| Black | `#000000` | Dark-slide base (usually behind a designed cover image) |
| White | `#FFFFFF` | Light-slide background; reversed text on lime/olive fills |
| Ink | `#1F2A37` | Primary dark text on light slides (preferred over pure `#212121`) |
| Slate | `#595959` | Body / secondary text, captions |
| Slate-mid | `#5B6675` | Table labels, metadata, sub-captions |
| Divider | `#D5D5D5` | Divider lines, muted numerals |
| Surface light | `#F3F3F3` / `#F8F9F8` | Card / panel fills |
| Surface blue | `#F4F6F9` | Alternating pipeline / card rows |
| Row alt | `#E9E9E9` | Table row alternates |

**Key signatures (from the reference deck):**
- **Titles and section intros are `Lime deep #656C18`** — not charcoal/black.
- **Eyebrows are `Lime primary #C2CF24`**, ALL-CAPS.
- **Number badges = `Lime dark #9FA742` fill with white numerals** (not bright lime with black).
- **Stand-up section headers** (`1. THE NUMBER — …`) = **white bold text on a lime-dark/olive bar**.

**Status pills** (white text): On track `#0F8A60` · Watch `#C08A2E` · At risk `#B23B3B`.
**Chart series:** blue `#7EB8F5` · green `#1D9E75` · red `#E24B4A` · amber `#EF9F27` · lime `#BFD146`.

---

## 2. Typography

**Two-typeface system** (this is the brand's actual font pairing — do **not** substitute Arial):

- **Poppins** — all headings, titles, eyebrows, big numerals, the pipeline chain, the cover,
  and footers. Use weights `Poppins Medium` (titles, eyebrows, numbers), `Poppins SemiBold`
  (card titles, sub-emphasis), `Poppins Light` (cover subtitle).
- **Source Sans Pro** — body text inside content/template slides: card descriptions, table
  cells, stand-up section labels and copy.

Fallback stack if a font is unavailable: `Poppins → Montserrat → Arial` for headings,
`Source Sans Pro → Segoe UI → Arial` for body. Hierarchy comes from size, weight, and color.

| Level | Size | Font / weight | Color |
|-------|------|---------------|-------|
| Cover hero title | 22 pt | Poppins Medium | White |
| Cover subtitle | 18 pt | Poppins Light | White |
| Section / slide title | 21 pt | Poppins Medium | **Lime deep `#656C18`** |
| Section intro line | 11 pt | Poppins | Lime deep `#656C18` |
| Stat callout | 16 pt | Poppins (bold) | Lime deep `#656C18` |
| Card header (THE NUMBER) | 14 pt | Source Sans Pro **Bold** | Ink `#1F2A37` |
| Card / segment title | 13–14 pt | Poppins SemiBold | Ink / White |
| Big numeral (badge) | 20 pt | Poppins Medium | White on lime-dark badge |
| Body | 9 pt | Source Sans Pro / Poppins | Slate `#595959` / Ink |
| Caption / meta / sub-label | 8 pt | Poppins / Source Sans Pro | Slate-mid `#5B6675` |
| Eyebrow / tag | 8 pt | Poppins Medium ALL-CAPS | **Lime primary `#C2CF24`** |
| Footer | 6 pt | Poppins Medium | White (dark) / Lime-muted `#A8B563` (light) |

Body copy stays at **8–9 pt** — density is intentional.

---

## 3. Separators (use these, not commas/colons)

| Glyph | Meaning |
|-------|---------|
| `·` | Label / tag separator (middle dot) |
| `—` | Label → value pair (`THE NUMBER — booked revenue today`) |
| `→` | Owner + deadline (`→ J. Tan · Fri`) |
| `›` | Pipeline / flow connector (`Pipeline › Commitment › Delivery › Invoice › Cash`) |

ALL-CAPS eyebrows introduce every section.

---

## 4. Layout archetypes

Pick one per slide. Title / section-cover / diagram slides are **dark**; content /
template / fill-in slides are **light**.

1. **Dark Cover** — full-bleed **designed dark background image** (not a flat black fill);
   **vertical logo top-right**; a **contact block top-right** (name · position · email ·
   websites, white Poppins Medium ~9.5 pt); eyebrows `OPERATING MODEL` / `ONE CHAIN OF VALUE`;
   hero title 22 pt + subtitle 18 pt (white); pipeline chain as a footer element; a **date
   stamp in lime-light `#C8D253`**; footer `©2026 Nexus Frontier Tech | Confidential` 6 pt.
2. **Two-Column Content** — white; thin lime left label column (~15%); main content right
   (~85%); large muted section numeral (20 pt); 14 pt bold title; 9 pt body.
3. **Horizontal Card Row** — 4–5 equal cards; circular lime number badge per card; title +
   description + owner label; alternating white / `#F4F6F9` fills; divider lines only.
4. **Four-Frame Grid** — 2×2 cards; each = big muted number (20 pt) + bold frame name
   (14 pt) + 9 pt description; white cards, subtle border.
5. **Stand-Up Template (fill-in)** — numbered sections `1.`–`4.`; each section header
   (`1. THE NUMBER — booked revenue today`) is **white bold Source Sans Pro on a lime-dark/olive
   bar**; descriptor row (8 pt bold) + value/copy row (8–9 pt) beneath; status column uses the
   status pills. Title is the team name (`Sales & BD — stand-up`, 21 pt lime-deep) with the
   `STAND-UP TEMPLATE · [TEAM]` eyebrow above.

**Optional — Concept / Flywheel slide:** decks may open (after the cover) with a concept slide
such as **The Compounding Flywheel** — a radial diagram plus 2–3 stat callouts (16 pt lime-deep:
e.g. `Fixed`, `100%`, `↑ Margin`). Add one when the deck needs to frame the business model
before the operating detail; keep it on brand (lime ramp, Poppins) and don't invent figures.

**Stand-up data table columns:** `Deal / Client | Value ($/m) | Prob % | Close by / Due | Action needed | Owner → Date`. Header 8 pt bold `#5B6675`; rows 8–9 pt, alternating white / `#E9E9E9`; horizontal dividers only (no vertical lines). **Every row needs an owner and a date.**

---

## 5. Brand assets (template/)

| File | Use |
|------|-----|
| `NFTLogo_Vertical_FullColour.png` | **Cover** — vertical lockup, **top-right**, paired with the contact block (~0.96 × 1.21 in) |
| `NFTLogo_Horizontal_FullColour.png` | Content slides / alternate placements where a horizontal mark reads better |

On the dark cover the logo sits on a **designed dark background image**, so the full-colour
vertical lockup reads cleanly top-right. (No white-only logo is shipped.)

---

## 6. Standing copy

- **Footer / copyright:** `©2026 Nexus Frontier Tech | Confidential` (6 pt Poppins Medium)
- **Websites:** `www.nexusfrontier.tech · www.onenexus.ai`
- **Slide size:** 16:9 standard — **`10" × 5.625"`** (PptxGenJS `LAYOUT_16x9`). This is what the
  reference deck uses; do **not** use 13.33 × 7.5.

---

## 7. Dos & Don'ts (quick)

**Do:** Poppins headings + Source Sans Pro body · titles in lime-deep `#656C18` · eyebrows in
bright lime `#C2CF24` · number badges in lime-dark `#9FA742` with white text · lead every
section with a number · `·` and `—` separators · dark cover + light content · every row has
owner + date · slide size 10 × 5.625.

**Don't:** use Arial as the brand font · make titles charcoal/black (they're lime-deep) · use
bright lime for large fills (use the muted/dark lime ramp) · gradients · a second accent family
on one slide · decorative borders or drop shadows · round figures · passive section headers ·
ownerless rows.
