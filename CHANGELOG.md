# Changelog

## v4.2.1 — 2026-06-10

### Changed
- **docs/design-system.html**: moved **Top Nav Bar** from the Chat Patterns section into Page Components. All components within each section are now sorted alphabetically.

---

## v4.2.0 — 2026-06-10

### Added
- **Tool Call Block** (`.tool-call` + `.tool-tag`): a recessed, monospace, left-railed line that renders a single agent tool / system call as a static output record. Tag label is configurable (`TOOL`, `MCP`, `SQL`, …). All styling references existing tokens, so dark mode is automatic.
- **Activity Trace Group** (`.trace-group`, `.trace-toggle`, `.trace-chevron`, `.trace-toggle-peek`, `.trace-list`, `.trace-line`): collapses a run of intermediate agent steps into one compact, expandable cluster behind a chevron toggle. Reuses the existing `.thinking-dots` indicator as its live companion.
- **core.js**: new locked APIs — `toolCallMarkup()`, `traceGroupMarkup()`, `toggleTrace()`, plus the live state machine `startTrace()` / `addTraceStep()` / `completeTrace()` (live group auto-expands; auto-collapses to `N steps · <last>` on completion; a manual toggle sticks). `sendMessage()` now streams a live trace during the thinking window instead of the bare dots.
- **docs/design-system.html**: new **Tool Call Block** (`#comp-tool-call`) and **Activity Trace** (`#comp-trace`) gallery sections with live demos (including a "Play live" trace), markup + JS snippets, and rules. Sidebar nav links added under Chat Patterns.
- **template/layout-shell.html**: seeded a collapsed trace group into the `#page-agent` starter conversation so it ships in every delivered demo.

### Notes
- No new design tokens — the components reuse `--surface-2`, `--border-strong`, `--border-subtle`, `--brand-primary`, `--text-1/2/3`, `--radius-sm` (all already dark-mode aware).
- Aligns the `core.js` header version stamp (was lagging at v4.1.0).

---

## v4.1.1 — 2026-06-09

### Fixed
- **docs/design-system.html**: Corrected misplaced `</div>` in History & Nav Controls section that left the prompt input bar block outside `.doc-demo`, causing `.doc-rules` callout banners to overflow the content column width.

### Changed
- **Top nav bar**: left zone fixed at `width:200px; box-sizing:border-box` (matches `#sidebar` width) so `.app-divider` aligns flush with the sidebar's right border. `pl-4` moved off `<nav>` into the left-zone div. App name gains `ml-3` (12px) gap from the divider.
- **Logo variants**: `onx-logo.png` replaced by `onx-logo-full-color.png` (light mode) and `onx-logo-white.png` (dark mode). Dark-mode swap rules (`.logo-light`/`.logo-dark`) moved into `core.css` dark-mode block — no more inline `<style>` in layout-shell.
- **History button moved to prompt bar**: removed `#history-toggle-btn` from the chat panel header; History (clock icon) now lives in the prompt input bar (`onclick="toggleHistory()"`) on both the welcome screen and active chat inputs.
- **core.css**: removed dead `#history-toggle-btn.is-active` rules; added `.logo-light`/`.logo-dark` dark-mode swap rules.
- **core.js**: removed dead `#history-toggle-btn` reference from `toggleHistory()`.
- **docs/design-system.html**: added new **Top Nav Bar** section (`#comp-topnav`) with live demo, markup snippet, and rules. Updated History & Nav Controls section to reflect three header controls (Artifact toggle, New Chat) and the moved History button. Added prompt bar demo.

---

## v4.1.0 — 2026-06-04

### Changed
- Extracted the inline base64 images out of `template/layout-shell.html` into real files — `template/onx-logo.png` (OneNexus logo) and `template/onx-agent-icon.png` (AI-agent icon). layout-shell.html drops from ~378KB to ~102KB and is readable again; the ~276KB of base64 that bloated it is gone.
- `layout-shell.html` now references the assets as `<img src="onx-logo.png">` / `onx-agent-icon.png`.
- `core.js` `getAgentIconSrc()` resolves the agent icon from either form — the asset path (reference docs) or an inlined data-URI (delivered app).
- Delivery: the agent now inlines **two PNGs** (re-encoded to data-URIs) alongside core.css/core.js. The delivered demo is still one self-contained file — client output is byte-for-byte equivalent.
- To rebrand the logo, swap `template/onx-logo.png` (no base64 surgery).

---

## v4.0.0 — 2026-06-04

**Breaking change — the single-file scaffold is retired.** Scaffolding now *composes* from two reference docs + a shared core instead of *adapting* one 4,120-line template.

### Added
- `template/core.css` — single source of truth for all brand tokens, component/layout CSS, and keyframes. Carries the canonical version stamp. Locked except the `--brand-*` block.
- `template/core.js` — single source of truth for all locked JS APIs. Adds a `window.ONX_TYPEWRITER` override seam so per-app typewriter prompts stay editable without touching core.
- `template/layout-shell.html` — **layout shell** reference: header, navbar, page wrapper, and the two layout archetypes (canvas `#page-agent`, document `#page-settings`). Doubles as the assembly skeleton; canonical home of the locked chat scaffold. Links the core.

### Changed
- `docs/design-system.html` — rebuilt as the **design system** reference: editable `--brand-*` block + a full component gallery (Buttons, Status Pills & Tags, KPI Cards, Data Table, Workflow Rows, Library Cards, Activity Feed, Forms, Empty State) alongside the existing chat patterns, each badged Strict/Flexible. Links `../template/core.css` instead of duplicating tokens/components.
- Delivered demos are still **one self-contained HTML file** — the agent inlines core.css/core.js into the output.
- Versioning: the version lives **once** in the `core.css` header. Dropped the manual "keep scaffold ↔ design-system in sync" mandate — the drift source is gone.
- `AGENTS.md` — rewritten around select-and-compose: read both references, pick an archetype per page, inline core on delivery.

### Removed / archived
- `template/onx-app-scaffold.html` → `template/_archive/2026-06-04/` (retired single file)
- previous `docs/design-system.html` → `docs/_archive/2026-06-04/`

---

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
