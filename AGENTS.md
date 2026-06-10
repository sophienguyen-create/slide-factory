# ONX Scaffold Skill

## Role
Build **OneNexus-branded demo apps** for client presentations. **Select and compose** from two reference docs — never adapt a single content template. Always produce a Build Plan and get approval before writing HTML. Build and review one page at a time.

## Inputs — two references + a shared core

| File | Role | How you use it |
|------|------|----------------|
| `template/layout-shell.html` | **Layout shell** — header, navbar, page wrapper, and the two layout archetypes: **canvas** (`#page-agent`, chat + artifact) and **document** (`#page-settings`, sub-nav + panels). Canonical home of the locked chat scaffold. | Pick an archetype per page; use this file as the **assembly skeleton**. |
| `docs/design-system.html` | **Design system** — branding (`--brand-*`) + the component gallery, each badged **Strict** (don't alter) or **Flexible** (adapt). | Pick components + branding for custom pages. |
| `template/core.css` + `template/core.js` | **Shared core** (single source of truth) — all tokens, component/layout CSS, keyframes, and the locked JS APIs. Carries the canonical version stamp. | **Inline** into the delivered single-file demo. Never edit except the `--brand-*` block. |
| `template/onx-logo-full-color.png` + `template/onx-logo-white.png` + `template/onx-agent-icon.png` | **Image assets** — the OneNexus logo (full-colour for light mode, white for dark mode) and AI-agent icon, referenced by `layout-shell.html` as `<img src>`. | **Inline** (re-encode to data-URI) into the delivered demo so it stays self-contained. |
| Client spec | **A file** from `specs/` (markdown doc, demo HTML, or JSX). A verbal description or chat prompt is not a spec and is not sufficient to begin. | Drives content, vocabulary, pages, and interactions. |

⚠️ **Do not read any files in `apps/`.** Delivered apps are client outputs, not references. Reading them causes wrong inference about UI behaviour and components. The only authoritative sources are the two reference docs + core above.

---

## Workflow

### Phase 1 — Read inputs

1. Read `docs/design-system.html` — the component gallery — to decide which components each page uses
2. Read `template/layout-shell.html` — to choose a **canvas** or **document** archetype per page and see the locked chrome
3. Read the client spec: product name, domain vocabulary, key screens, user persona, and — critically — **every interaction** (clicks, drill-downs, filters, modals)
4. Read nothing else — do not browse `apps/` or any other file unless explicitly asked

### Phase 2 — Build Plan

Output the Build Plan, then **stop**. Do not write any HTML until the user explicitly approves the plan.

```markdown
## Build Plan: [App Name]

### App Identity
- App name: [name]
- User persona: [name + initials]
- Typewriter prompts: ["...", "...", "..."]
- Suggestion pills: ["...", "...", "..."]

### Pages
| Page | Archetype | Purpose | UI components (from design-system.html) |
|------|-----------|---------|------------------------------------------|
| Agent | canvas | [description] | thread list, suggestion pills |
| [Custom page 1] | document | [description] | .kpi-card ×3, .data-table, etc |
| [Custom page 2] | document | [description] | .workflow-row, .status-pill, etc |
| Settings | document | pre-wired | org name, team, connectors only |

### Interactions
| Trigger | Behaviour |
|---------|-----------|
| Click row in [page] | [what opens — detail page / panel / modal] |
| Click [button] | [modal with openModal() / page nav / inline toggle] |
| [filter chip] | [JS filter on visible rows] |

### Clarifying Questions
1. [Any gaps from spec]
2. [Any new UI components required]
```

End the Build Plan with:

```text
Reply **approved** to begin building, or request changes to the plan.
```

**Do not write any HTML until the user replies with an explicit approval.**

### Phase 3 — Build page by page

Build one page at a time in the order listed in the Build Plan. After each page:

1. Run the per-page checklist silently
2. Fix anything that fails before presenting
3. Output the required stop block below — then **stop**. Do not write any HTML for the next page until the user replies.

**Per-page checklist (run silently before presenting each page):**

- [ ] Every interaction listed for this page in the Build Plan is implemented
- [ ] Every row click, card click, and button has an explicit `onclick` — no unlinked elements
- [ ] Drill-downs open the correct target (detail panel, modal, or new page) — not a stub or placeholder
- [ ] Filter chips, if present, visibly filter the rows beneath them
- [ ] No "coming soon" text or empty `href="#"` without a handler

**Required stop block — output this exactly after every page:**

```
---
✅ Page [n / total] — [Page Name]
Interactions implemented: [bullet list of what was wired up]

Open apps/[AppName]-app.html and review this page.
Reply **approved** to continue to [Next Page Name], or describe what to change.
---
```

**Do not begin the next page until the user replies with an explicit approval. Proceeding without approval is a hard failure.**

### Phase 4 — Final Check

Run the LOCKED checklist before delivering.

### Phase 5 — Deliver

The delivered demo is **one self-contained HTML file**. Assemble it:

1. **Start from `template/layout-shell.html`** as the skeleton (head + chrome + chosen archetypes).
2. **Inline the core** — replace `<link rel="stylesheet" href="core.css">` with `<style>…contents of template/core.css…</style>`, and `<script src="core.js"></script>` with `<script>…contents of template/core.js…</script>`.
3. **Inline the image assets** — re-encode `template/onx-logo-full-color.png`, `template/onx-logo-white.png`, and `template/onx-agent-icon.png` to base64 and replace their `src` attributes with `src="data:image/png;base64,…"`. After this the output must open standalone with **no relative dependencies** (no `href="core.css"`, `src="core.js"`, or `*.png` paths left).
4. **Copy the locked chat scaffold** (`#page-agent`) verbatim from layout-shell. Keep only the archetypes you use; build custom pages by dropping in components from `docs/design-system.html`.
5. Save to `apps/[AppName]-app.html` (derived from app name, kebab-cased).

Add a version stamp as the first line of the delivered file:

```html
<!-- Built with ONX Scaffold vX.X.X — [date] -->
```

Read the version from the header of `template/core.css` (`ONX Scaffold core.css — vX.X.X`) — core.css is the single source of truth.

---

## Common Interaction Patterns

The most common agent failure is omitting drill-down and interactive behaviour visible in the spec. For every page, identify and implement:

| Pattern | Implementation |
|---------|----------------|
| Row / card click → detail view | `onclick="showPage('page-detail')"` or slide-in `.flat-panel-right` |
| Button → confirmation | `openModal({ title, body, confirmLabel, danger, onConfirm })` |
| Tab / filter switching | `.filter-chip` set + JS to toggle `.hidden` on rows or sections |
| Expand / collapse row | Inline `onclick` toggling a `details` child element |
| Status badge filter | Filter chip group + JS filtering on `data-status` attributes |

**Default rule:** if the spec shows a table or list, always ask in the Build Plan — *what happens when you click a row?* If the spec is silent, default to an artifact panel (`toggleArtifact()`), not a new page.

---

## Scaffold Structure

### `template/layout-shell.html` — the assembly skeleton

- **Canvas archetype (`#page-agent`)** — fill 2 anchors, rest is locked:
  - `<!-- DEMO: Thread list -->` — 3–5 sample threads from client spec
  - `window.ONX_TYPEWRITER` (inline `<script>` before core.js — seam already in layout-shell) — 3–4 domain-specific prompts, under 50 chars each
- **Document archetype (`#page-settings`)** — pre-wired, update org values only:
  - `<!-- DEMO: User profile -->` — client persona name + contact details
  - Org name, team members, integration names in the relevant settings panels
- The components nav item is already gone — start from this file and the delivered app has no reference page to remove.

### `docs/design-system.html` — component gallery (reference only, never shipped)

One live example of every reusable component, each badged **Strict** / **Flexible**. Browse this when deciding which components to use on custom pages.

### `template/core.css` + `template/core.js` — shared core

Single source of truth for all tokens, component/layout CSS, keyframes, and JS APIs. Inlined into the delivered demo. Never edit except the `--brand-*` block in core.css.

### `template/onx-logo-full-color.png` + `template/onx-logo-white.png` + `template/onx-agent-icon.png` — image assets

The OneNexus logo (full-colour for light mode, white for dark mode) and AI-agent icon, kept as real PNG files (not inline base64) so `layout-shell.html` stays small and readable. `core.js` resolves the agent icon from whichever form is present — the file path (reference) or an inlined data-URI (delivered app). Inline all three into the delivered demo. To rebrand the logo, swap both `onx-logo-full-color.png` and `onx-logo-white.png`.

### Custom client pages

Copy `<!-- NEW PAGE TEMPLATE -->` (at the bottom of layout-shell.html). Choose components from `docs/design-system.html`. Add the matching sidebar nav entry.

---

## LOCKED (Do Not Modify)

⚠️ Everything not listed under FLEXIBLE is locked. `template/core.css` and `template/core.js` are locked wholesale (only the `--brand-*` block in core.css is editable). Changing anything else breaks the scaffold.

| Category | Elements | Lives in |
|----------|----------|----------|
| Brand | `--brand-*` CSS vars (the one editable block), OneNexus `<img>` logo | core.css / layout-shell.html |
| Layout | `.app-nav`, `aside#sidebar`, `.flat-panel`, `.flat-panel-right`, `p-3 gap-3` wrapper | core.css / layout-shell.html |
| Chat | `.chat-turn`, `.bubble-actions`, `.bubble-actions-time`, `.agent-icon-*`, `.artifact-pointer`, `.thread-section`, `.typewriter-*` | core.css / layout-shell.html |
| Animations | `@keyframes aiGlowIdle`, `aiGlowThinking`, `aiGlowHero` | core.css |
| JS APIs | `formatMessageTime()`, `bubbleActionsMarkup()`, `userTurnMarkup()`, `aiTurnMarkup()`, `aiThinkingMarkup()`, `threadSectionMarkup()`, `artifactPointerMarkup()`, `copyBubble()`, `showSources()`, `startTypewriter()`, `stopTypewriter()`, `typewriterTypeMessage()`, `toggleHistory()`, `toggleArtifact()`, `showNewChat()` | core.js |

---

## FLEXIBLE (What to Change)

### App name — exactly 2 places
| Location | Example |
|----------|---------|
| `<title>[App Name] — OneNexus</title>` | `<title>Apex Recon Hub — OneNexus</title>` |
| `<span class="app-name">[App Name]</span>` | `<span class="app-name">Apex Recon Hub</span>` |

### User identity
- `#welcome-name` — display name
- Avatar initials in sidebar footer + chat bubbles

### Typewriter prompts
core.js is locked, so override the prompts via a global — add an inline `<script>` **before** `core.js` loads (layout-shell.html already has the seam):
```html
<script>window.ONX_TYPEWRITER = ["Summarise today's exception queue.","Flag the open exceptions.","Compare to last cycle."];</script>
```
3–4 items, each under 50 characters. Action-oriented, domain-specific.

**Good:** `"Summarise today's exception queue."`
**Bad:** `"What needs attention today?"`

### Sidebar nav items
Add/remove `<a class="nav-item">` entries. Always pair with a Lucide icon:
```html
<a href="#" onclick="showPage('page-id')" id="nav-page-id" class="nav-item">
  <i data-lucide="ICON_NAME" class="icon-md"></i>
  <span class="nav-label">Label</span>
</a>
```

To group nav items under a section label, use `.sidebar-section-divider` with `.nav-section-label` on the text span. The `.nav-section-label` class is automatically hidden when the sidebar collapses — the divider line remains for visual grouping:
```html
<div class="sidebar-section-divider">
  <span class="nav-section-label">SECTION NAME</span>
</div>
```

(layout-shell.html has no components nav item, so there's nothing to remove from the delivered app.)

### Page content
Build pages using component classes from `docs/design-system.html`:
- `.kpi-card`, `.section-card`, `.data-table`
- `.workflow-row`, `.library-card`, `.activity-item`
- `.status-pill`, `.filter-chip`, `.tag`
- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger`, `.btn-icon`
- `.form-label`, `.form-input`, `.form-select`, `.form-help`

### Suggestion pills
Update `onclick="homePrompt('...')"` text. 3 pills max, 50 chars each.

---

## Content Anchors

Four `<!-- DEMO: ... -->` anchors live in `template/layout-shell.html`. All other content is built from scratch on custom pages.

| Anchor | What to place |
|--------|---------------|
| `DEMO: User identity` | Client persona name + initials |
| `DEMO: Thread list` | 3–5 sample threads from client spec |
| `DEMO: User profile` | Client contact from spec (settings page) |
| `DEMO: Data connectors` | Client's actual systems — any domain (e.g. Bloomberg, Salesforce, Epic, SAP) |

---

## Quickstart

When the user says **"onx scaffold"**, open with: "Let's build a OneNexus-branded demo app. I'll need a few things before we start." Then walk them through the steps below before touching any HTML.

### Step 1 — What to have ready

Ask the user to confirm they have the following before starting:

| Input | What it is | Required? |
|-------|-----------|-----------|
| **App name** | The title shown in the browser and sidebar (e.g. "Apex Recon Hub") | Yes |
| **Industry / domain** | One phrase — used to pick vocabulary and example data (e.g. "fund reconciliation", "insurance claims") | Yes |
| **Client spec file** | An existing document — markdown, demo HTML, or JSX. Must be a file, not a description typed in chat. | Yes |
| **User persona** | The name and initials of the demo user (e.g. "Sarah Chen / SC") | Recommended |
| **Key interactions** | Any click-through flows — what happens when a user clicks a row, a card, or a button | Recommended |

**If no spec file is provided, do not begin.** Respond: "Please share the client spec file (markdown, HTML, or JSX) before we start. A description in chat is not sufficient." Once a file is provided, check it covers enough of Step 2 before producing the Build Plan.

### Step 2 — What makes a useful spec

A good spec answers these questions. The more that are covered, the fewer gaps the agent needs to infer:

- **Pages** — what screens does the app need, and what is each one for?
- **Metrics / KPIs** — what numbers matter? (names, not just values)
- **Workflows** — what processes or queues does the app manage?
- **Drill-downs** — when a user clicks a row or card, what do they see?
- **Data sources** — what systems does the app connect to?
- **Sample data** — even rough examples of row content, event names, or report titles
- **Persona** — who is being demoed to, and what is their role?

A spec does not need to include design decisions, layout choices, or component names — those come from the scaffold.

### Step 3 — What happens next

Once inputs are confirmed:

1. The agent reads the spec + the two reference docs and produces a **Build Plan** — page list (with canvas/document archetype per page), component choices, and identified interactions. Review and approve before any HTML is written.
2. Pages are built **one at a time**. After each page the agent shares the file and waits for feedback before continuing.
3. On completion, the agent inlines `core.css`, `core.js`, and the two PNG assets into one self-contained file and runs the locked checklist.
4. Final file is saved to `apps/[AppName]-app.html` (derived from app name, kebab-cased).

### Step 4 — How to give good feedback during the build

- **Be specific about interactions:** "clicking a row should open a detail panel" beats "make it more interactive"
- **Name the page:** "on the Alerts page, the status filter isn't working" not "the filter is broken"
- **Approve explicitly:** say "looks good, continue" or "approved" — the agent will not move on until you do
- If something looks wrong, say so before approving — rebuilding a page costs more than reviewing it

---

## Verify Before Delivering

### Delivered-app integrity
- [ ] `--brand-*` vars unchanged (only the editable block may be re-themed)
- [ ] OneNexus logo `<img>` intact
- [ ] Chat panel markup copied verbatim from layout-shell
- [ ] `core.css`, `core.js`, **and** all three PNGs (`onx-logo-full-color.png`, `onx-logo-white.png`, `onx-agent-icon.png`) inlined — file opens standalone with no relative deps (`*.png`/`.css`/`.js` paths)
- [ ] All 3 `@keyframes aiGlow*` present (they come with core.css)
- [ ] `.artifact-pointer` used (not plain `<a>`)
- [ ] `window.ONX_TYPEWRITER` set with domain prompts (before core.js)
- [ ] Core inlined once — no duplicate JS functions
- [ ] Every interaction from Build Plan is implemented (no "coming soon" stubs)

### Documentation & versioning (required for every core/reference change)
- [ ] `CHANGELOG.md` has a new entry describing the change
- [ ] Version bumped **once** in `template/core.css` header (the single source of truth)
- [ ] `<meta name="onx-scaffold-version">` in `template/layout-shell.html` + `docs/design-system.html` matches core.css
- [ ] `docs/design-system.html` updated if any component, panel, or label changed

---

## Output

| Item | Location |
|------|----------|
| Prototype HTML | `apps/[AppName]-app.html` (derived from app name, kebab-cased) |
| App name | `<title>` + `.app-name` span |
| User identity | Welcome name + avatar initials |
| Typewriter prompts | 3–4 domain-specific items |
| Nav + pages | Custom pages built from spec |
| Settings | Org name, team, integrations pre-filled |
| Interactions | All drill-downs and actions wired up |

---

## Iteration After First Delivery

### Phase 1 — Read ground truth first (always)

Before touching any delivered app, read the four reference sources in order:

1. `template/core.css` — version stamp and token changes
2. `CHANGELOG.md` — what changed between the app's version and the current version
3. `docs/design-system.html` — updated components, new classes, removed patterns
4. `template/layout-shell.html` — structural or chrome changes

Do **not** skip this step even for small edits. The delivered app may be behind the current scaffold version; without reading the references you will propagate stale patterns.

### Phase 2 — Propose an Editing Plan

Output a concise plan, then **stop**:

```markdown
## Editing Plan: [App Name]

### Scaffold version in delivered app: vX.X.X
### Current scaffold version: vX.X.X
### Version delta (if any): [list relevant changes from CHANGELOG.md that affect this app]

### Requested changes
| # | Change | Where | Notes |
|---|--------|-------|-------|
| 1 | [description] | [page / component] | [any constraints] |

### Additional fixes (scaffold drift)
| # | Fix | Why |
|---|-----|-----|
| 1 | [e.g. replace deprecated .old-class with .new-class] | [found in design-system diff] |

Reply **approved** to apply these changes, or describe what to adjust.
```

Do **not** edit any file until the user replies with an explicit approval.

### Phase 3 — Apply changes

Patch only what is listed in the approved Editing Plan — don't regenerate the whole file. Update the version stamp in the file's first-line comment to match the current scaffold version after applying any scaffold-drift fixes.

Examples of iteration requests:
- *"Update the data integration list to include [X]"*
- *"Change the user persona to [Y]"*
- *"Rename the 'Exceptions' page to 'Flags'"*
- *"Wire up the row click on the Alerts table"*
