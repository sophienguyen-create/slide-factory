---
title: Architecture Decisions
description: Key design decisions for onx-scaffold (ONX demo-app builder) with rationale and alternatives considered
last_updated: 2026-06-03
version: 1
tags: [architecture, decisions, design]
---

# Architecture Decisions

Records of significant design decisions for **onx-scaffold** (the ONX OneNexus demo-app builder skill).

Each decision follows the format: **Context → Decision → Rationale → Alternatives Considered**.

---

## ADR-001: Retrofit brand compliance from a scaffold-derived spec instead of rebuilding from the empty scaffold

**Status:** ✅ Accepted

**Context.** Some client specs (e.g. `specs/onx_sales_intelligence.html`) arrive as complete, self-contained apps that were themselves authored from this scaffold — same class names (`.app-nav`, `.nav-item`, `.section-card`, `.status-pill`, `.filter-chip`, `.btn`), same `showPage` semantics. But they override locked brand elements: the Sales Intelligence spec recolored `--brand-*` from teal (`#2D7575`) to navy/gold (`#0D1F3C` / `#C9922A`) and swapped the locked OneNexus `<img>` logo for a custom SVG. The standard workflow says to compose pages from scaffold components page-by-page.

**Decision.** When a spec is already scaffold-derived and fully functional, **base the deliverable on the spec and retrofit it into brand compliance** rather than re-porting its data/render/interaction JS onto an empty scaffold base. The retrofit: restore the locked teal `--brand-*` / `--onx-*` tokens, restore the OneNexus `<img>` logo (splice the base64 from `template/layout-shell.html` — see note below), re-point hardcoded brand hexes (navy → teal), restore `--surface-inverse` / `--unread` / `--ring` to scaffold values, and add the version stamp. Supplementary semantic colors (gold/red/green) may stay as long as they are not `--brand-*`/`--onx-*`.

**Rationale.** The spec carries a self-contained JS engine (its own `showPage`, dark mode, sidebar toggle, and ~50 render/admin functions). Re-porting that onto the scaffold's separate JS infrastructure would produce conflicting duplicate functions and a very large regression surface. Retrofitting fixes the handful of locked violations deterministically (tokens + logo) while preserving thousands of lines of already-working behavior.

**Alternatives considered.**
- *Rebuild from the empty scaffold, porting data + render functions* — rejected: duplicate-function conflicts (two `showPage`/`toggleDarkMode`/`toggleSidebar`), enormous surface area, high risk of shipping a broken app.
- *Ship the spec as-is* — rejected: violates the locked brand (`--brand-*` vars) and the OneNexus logo lock.

**Note.** This applies **only** when the spec is itself scaffold-derived (shares the scaffold's class names and `showPage` model). A non-scaffold spec must be composed from scaffold components per the standard page-by-page workflow.

**Update (2026-06-04, v4.0.0 refactor).** The single-file `template/onx-app-scaffold.html` referenced in the original decision was retired and archived to `template/_archive/2026-06-04/`. The OneNexus logo base64 now lives in `template/layout-shell.html` — splice it from there. The decision itself is unchanged.

---

## ADR-002: Store per-rep usage state in separate localStorage keys, distinct from admin-editable content

**Status:** ✅ Accepted

**Context.** The Sales Intelligence app added a rep "Opportunities" pipeline (auto-captured when a rep prints the ROI one-pager) and a "Recently viewed" dashboard filter. The app already persists admin-editable content to `localStorage` under `onx_sales_intel_v2`, with Admin export / import / reset operating on that object.

**Decision.** Persist per-rep usage state in **separate** `localStorage` keys — `onx_si_opps` (pipeline) and `onx_si_recent` (recently-viewed) — never inside the admin `DATA` object.

**Rationale.** Usage state is not editable content. Keeping it separate means admin **Reset** and **Import** (which replace `DATA`) don't wipe a rep's pipeline, and content backups (the exported JSON) stay clean — no per-user data leaks into shared content exports.

**Alternatives considered.**
- *Store opportunities/recent inside `DATA`* — rejected: admin reset/import would destroy the rep's pipeline, and usage data would pollute content backups shared across machines.

---

## Decision Log Summary

| ID | Decision | Status |
|----|----------|--------|
| ADR-001 | Retrofit brand compliance from a scaffold-derived spec instead of rebuilding | ✅ Accepted |
| ADR-002 | Per-rep usage state in separate localStorage keys, distinct from content | ✅ Accepted |
