# Changelog

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
