# Changelog

## v1.1.0 — 2026-06-13

Calibrated the brand core against the reference ("Target") deck so future output matches it more
closely. Updated `template/brand-core.md`, `docs/nexus-frontier-brand-guidelines.md`, and
`AGENTS.md`.

### Changed
- **Typography:** corrected the brand fonts from `Arial` to the deck's real pairing —
  **Poppins** (headings, titles, eyebrows, numerals, footer) + **Source Sans Pro** (body, tables,
  stand-up labels). Type scale updated to the reference deck's actual sizes (hero 22, section
  title 21, eyebrow 8, card header 14, body 9, footer 6).
- **Slide size:** corrected from `13.33 × 7.5` to **`10 × 5.625`** (`LAYOUT_16x9`).
- **Color signatures:** documented that **section/slide titles are lime-deep `#656C18`**,
  **eyebrows are bright lime `#C2CF24`**, and **number badges are lime-dark `#9FA742` with white
  text**. Added the muted lime ramp (`#9FA742` / `#74792E` / `#EBEEC5` / `#C8D253`) for fills and
  `#1F2A37` as the preferred dark text. Bright lime is now reserved for thin accents/eyebrows.
- **Cover archetype:** full-bleed designed dark background image, **vertical logo top-right +
  contact block**, date stamp in lime-light.
- **Stand-up template:** section headers are white bold on a lime-dark/olive bar.

### Added
- Optional **concept / flywheel** slide archetype (radial diagram + stat callouts) for framing
  the business model after the cover.

---

## v1.0.0 — 2026-06-13

Initial release of **Slide Factory** — a scaffold that turns a draft input deck into a
polished, Nexus Frontier–branded `.pptx`.

### Added
- **`template/brand-core.md`**: the build-facing brand core — color tokens, type scale,
  separators (`·` `—` `→` `›`), the 5 layout archetypes, status pills, footer/copyright, and
  logo placement rules. Carries the canonical version stamp.
- **`AGENTS.md`**: the slide-build workflow — read brand-core + the named input draft → Build
  Plan (slide-by-slide map, stop for approval) → build a native `.pptx` via the pptx skill →
  brand-fidelity check → deliver to `apps/`. Includes an iteration phase for editing decks.
- **`README.md`**: human-facing usage and folder structure.
- **`scripts/pre-commit`**: enforces a version bump in `brand-core.md` + a CHANGELOG entry
  whenever the brand-core or the guidelines doc changes.
- **`docs/nexus-frontier-brand-guidelines.md`**: full brand & design-system reference (carried
  over as the canonical guidelines).

### Removed
- Old HTML-scaffold core (`template/core.css`, `template/core.js`) and the HTML-app build
  instructions — Slide Factory produces `.pptx` decks, not HTML demo apps.

### Notes
- Inputs in `specs/` and outputs in `apps/` stay out of the auto-index (`.claudeignore`); the
  agent reads the input draft only when the user names it.
