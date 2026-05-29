# Changelog

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
