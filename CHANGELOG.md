# Changelog

## v3.5.4 — 2026-05-29

### Fixed
- Removed `localStorage` page persistence (`onx-active-page`). App always opens on the Agent page on reload — correct behaviour for demos. Both the save (`setItem` in `showPage()`) and restore (`getItem` on init) removed.

### Docs (2026-06-02)
- `docs/design-system.html` nav bar now shows version number next to "Scaffold Docs" — visible at a glance without inspecting source
- `docs/design-system.html` — added Intelligence Banner, Inline Agent Panel, and Workflow Stepper component sections (live demos, markup, and rules)
- `AGENTS.md` — stronger phase gates; explicit stop blocks after Build Plan and each page; "do not read apps/" guard
- `README.md` — extended onboarding from git clone; added link to CHANGELOG.md

---

## v3.5.3 — 2026-05-29

### Added
- `#sidebar.collapsed .nav-section-label` — hides section label text on collapse; divider line stays for visual grouping
- `.sidebar-section-divider` + `.nav-section-label` documented as the canonical pattern for sidebar group labels in `AGENTS.md`

---

## v3.5.2 — 2026-05-29

### Changed
- `--text-3` light mode contrast fix: added `html:not(.dark) { --text-3: #64748B }` (slate-500, 4.9:1 on white ✓ WCAG AA). Dark mode retains `#94A3B8` (6.7:1 on dark surfaces). Fixes column headers, KPI labels, section subtitles, page subtitles, activity timestamps, stepper inactive labels, form help text — all in one token override.

---

## v3.5.1 — 2026-05-29

### Changed
- `.panel-bubble` — removed teal-wash background/border; now flat transparent text matching `.chat-bubble-ai` on the agent page
- `.panel-bubble-tool` — replaced full card border with `border-left: 2px solid --border-strong` code-block style; reduced opacity (`--text-3`) to read as system output, not prose
- `.page-agent-panel-footer` — replaced standalone `<input>` + icon button with `.chat-input-shell` + `<textarea>` + `.send-fab`, matching the agent page input pattern exactly
- Removed `.page-agent-panel-input` CSS class (no longer needed)
- Removed dark mode override for `.panel-bubble` (no longer needed — transparent has no color to swap)

---

## v3.5.0 — 2026-05-29

### Added
- `.intelligence-banner` — AI briefing card for top of document-layout pages. White bg + `border-left: 3px solid --brand-primary` (editorial treatment, distinct from `.kpi-card`). Includes `.intelligence-banner-icon`, `.intelligence-banner-eyebrow`, `.intelligence-banner-text`, `.intelligence-banner-actions`, `.intelligence-pill`.
- `.page-agent-panel` — Fixed 300px right-column contextual agent chat panel. Two bubble types: `.panel-bubble` (AI prose, `rgba(45,117,117,0.08)` teal wash) and `.panel-bubble-tool` (tool output, `--surface-2` gray monospace). Includes header, scrollable body, footer input.
- `.workflow-stepper` — Horizontal step progress indicator with `.stepper-step`, `.stepper-circle`, `.stepper-label`, `.stepper-connector`. States: `.is-active` (brand-primary), `.is-done` (status-success + check icon).
- All three components added to `page-components` gallery with live examples (two stepper states shown).
- Dark mode overrides for all new components; font-scale (`--fz`) entries added for all new fixed-px sizes.

---

## v3.4.1 — 2026-05-29

### Changed
- `aside#sidebar` — lightened background to `var(--surface-1)` (was `--surface-2`); border-right retained for separation

---

## v3.4.0 — 2026-05-29

### Changed
- `aside#sidebar` — `background: var(--surface-2)` + `border-right: 1px solid var(--border-subtle)` to visually separate sidebar from document layout content area (was transparent/no border)
- Works in both light (`#F4F4F5`) and dark (`#1F2A40`) modes

---

## v3.3.1 — 2026-05-29

### Changed
- `.kpi-card` — replaced brand-tint gradient with solid `var(--brand-tint)` background (cleaner, no fade artefact)

---

## v3.3.0 — 2026-05-29

### Changed
- `.kpi-card` — added brand-tint gradient background (`--brand-tint` → `--surface-0` at 65%) and `border-top: 2px solid var(--brand-primary)` accent bar
- Dark mode: added `--brand-tint: rgba(45,117,117,0.14)` override so KPI gradient renders correctly on dark card surfaces (was `#E6F4F4` which clashed with `#1A2335` cards)
- Adapters can override accent color per card with `style="border-top-color: var(--status-danger)"` or any token

---

## v3.2.0 — 2026-05-29

### Changed
- `.kpi-card` — upgraded to `--shadow-2` + `--border` (stronger than section cards, establishes KPI hierarchy)
- `.section-card`, `.library-card`, `.workflow-row` — added `--shadow-1` at rest to lift cards off white canvas without changing surface tokens
- `.library-card` hover — promoted to `--shadow-2` (was already there, workflow-row hover matched)
- `--border-subtle` strengthened from `#F1F5F9` → `#E2E8F0` for better table/divider visibility
- Canvas (`--surface-1`) kept pure white — card definition handled by shadow hierarchy, not background tint

---

## v3.1.0 — 2026-05-29

### Changed
- Renamed Settings > Integrations → **Connectors** (`data-panel="connectors"`, nav label, section title)
- Connector rows are now domain-agnostic and marked `<!-- DEMO: Data connectors -->` — replace per client spec
- Updated `docs/design-system.html` and `AGENTS.md` to reflect Connectors terminology

---

## v3.0.0 — 2026-05-29

### Breaking
- Removed sample pages: `page-runs`, `page-test-suites`, `page-script-library`, `page-data-sources`, `page-reports`
- Removed corresponding nav items and sidebar divider
- Removed `[ClientName]` input — output filename now derived from app name

### Added
- `page-components` — live component gallery replacing the removed sample pages
- `specs/` directory — canonical location for client spec files before scaffolding
- `docs/design-system.html` — moved from `README.html`, renamed for clarity
- `README.md` — 3-step onboarding for new team members
- `CHANGELOG.md` — this file
- Version metadata comment + `<meta>` tags in scaffold and design system

### Changed
- `AGENTS.md` — rewritten: removed Plan/One-Shot modes, mandatory Build Plan gate, page-by-page build workflow, explicit interactions section, user-facing Quickstart
- Project structure reorganised: `docs/`, `specs/`, `template/`, `apps/`
- Archive files removed — git history replaces manual archiving

---

## v2.0.0

Dark mode, responsive sidebar, artifact panel resize, settings panels.

## v1.0.0

Initial scaffold with chat panel, typewriter, avatar glow states.
