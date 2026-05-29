# ONX Scaffold Skill

## Role
Build **OneNexus-branded demo apps** for client presentations. Compose pages from scaffold components using `template/onx-app-scaffold.html` as a **UI component library and layout reference** — not a content template to fill in. Always produce a Build Plan and get approval before writing HTML. Build and review one page at a time.

## Inputs

- `template/onx-app-scaffold.html` — component reference (Agent, Components, Settings pages)
- Client spec — **a file** from `specs/` (markdown doc, demo HTML, or JSX). A verbal description or chat prompt is not a spec and is not sufficient to begin.

---

## Workflow

### Phase 1 — Read inputs

1. Read `page-components` in the scaffold for the full component library
2. Read the client spec: product name, domain vocabulary, key screens, user persona, and — critically — **every interaction** (clicks, drill-downs, filters, modals)

### Phase 2 — Build Plan (always required)

Output a Build Plan and **wait for approval before writing any HTML.**

```markdown
## Build Plan: [App Name]

### App Identity
- App name: [name]
- User persona: [name + initials]
- Typewriter prompts: ["...", "...", "..."]
- Suggestion pills: ["...", "...", "..."]

### Pages
| Page | Purpose | Key components |
|------|---------|----------------|
| Agent | [description] | thread list, suggestion pills |
| [Custom page 1] | [description] | .kpi-card ×3, .data-table |
| [Custom page 2] | [description] | .workflow-row, .status-pill |
| Settings | pre-wired | org name, team, integrations only |

### Interactions
| Trigger | Behaviour |
|---------|-----------|
| Click row in [page] | [what opens — detail page / panel / modal] |
| Click [button] | [modal with openModal() / page nav / inline toggle] |
| [filter chip] | [JS filter on visible rows] |

### Clarifying Questions
1. [Any gaps from spec]
```

### Phase 3 — Build page by page

- Build one page at a time in order from the Build Plan
- After each page, run the per-page checklist below before sharing with the user
- Never start the next page until the current one is approved

**Per-page checklist (run after every page, before asking for approval):**
- [ ] Every interaction listed for this page in the Build Plan is implemented
- [ ] Every row click, card click, and button has an explicit `onclick` — no unlinked elements
- [ ] Drill-downs open the correct target (detail panel, modal, or new page) — not a stub or placeholder
- [ ] Filter chips, if present, visibly filter the rows beneath them
- [ ] No "coming soon" text or empty `href="#"` without a handler

Report the checklist result to the user: "Interactions verified: [list what was implemented]." If anything is missing, fix it before sharing.

### Phase 4 — Verify

Run the LOCKED checklist before delivering.

### Phase 5 — Deliver

Save to `apps/[AppName]-app.html` (derived from app name, kebab-cased). Add a version stamp as the first line of the delivered file:
```html
<!-- Built with ONX Scaffold v3.0.0 — [date] -->
```
Read the scaffold's version from its `<!-- ONX Scaffold vX.X.X -->` comment to get the correct number.

---

## Interactions — Build These, Don't Skip

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

### `page-agent` — fill 2 anchors, rest is locked
- `<!-- DEMO: Thread list -->` — 3–5 sample threads from client spec
- `typewriterMessages[]` in JS — 3–4 domain-specific prompts, under 50 chars each

### `page-components` — reference only, never ship to client
Contains one live example of every reusable component. Browse this when deciding which components to use on custom pages. Remove this nav item from the delivered app.

### `page-settings` — pre-wired, update org values only
- `<!-- DEMO: User profile -->` — client persona name + contact details
- Org name, team members, integration names in the relevant settings panels

### Custom client pages
Copy `<!-- NEW PAGE TEMPLATE -->` at EOF. Choose components from `page-components`. Add the matching nav entry.

---

## LOCKED (Do Not Modify)

⚠️ Everything not listed under FLEXIBLE is locked. Changing it breaks the scaffold.

| Category | Elements |
|----------|----------|
| Brand | `--brand-*` CSS vars, OneNexus `<img>` logo |
| Layout | `.app-nav`, `aside#sidebar`, `.flat-panel`, `.flat-panel-right`, `p-3 gap-3` wrapper |
| Chat | `.chat-turn`, `.bubble-actions`, `.bubble-actions-time`, `.agent-icon-*`, `.artifact-pointer`, `.thread-section`, `.typewriter-*` |
| Animations | `@keyframes aiGlowIdle`, `aiGlowThinking`, `aiGlowHero` |
| JS APIs | `formatMessageTime()`, `bubbleActionsMarkup()`, `userTurnMarkup()`, `aiTurnMarkup()`, `aiThinkingMarkup()`, `threadSectionMarkup()`, `artifactPointerMarkup()`, `copyBubble()`, `showSources()`, `startTypewriter()`, `stopTypewriter()`, `typewriterTypeMessage()`, `toggleHistory()`, `toggleArtifact()`, `showNewChat()` |

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
Edit `typewriterMessages[]` in JS. 3–4 items, each under 50 characters. Action-oriented, domain-specific.

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

Remove `nav-components` from the delivered app (it's a scaffold reference, not a product page).

### Page content
Build pages using component classes from `page-components`:
- `.kpi-card`, `.section-card`, `.data-table`
- `.workflow-row`, `.library-card`, `.activity-item`
- `.status-pill`, `.filter-chip`, `.tag`
- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger`, `.btn-icon`
- `.form-label`, `.form-input`, `.form-select`, `.form-help`

### Suggestion pills
Update `onclick="homePrompt('...')"` text. 3 pills max, 50 chars each.

---

## Content Anchors

Three `<!-- DEMO: ... -->` anchors remain in the scaffold. All other content is built from scratch on custom pages.

| Anchor | What to place |
|--------|---------------|
| `DEMO: User identity` | Client persona name + initials |
| `DEMO: Thread list` | 3–5 sample threads from client spec |
| `DEMO: User profile` | Client contact from spec (settings page) |

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

1. The agent reads the spec and produces a **Build Plan** — page list, component choices, and identified interactions. Review and approve before any HTML is written.
2. Pages are built **one at a time**. After each page the agent shares the file and waits for feedback before continuing.
3. On completion, the agent removes the Components reference page and runs the locked checklist.
4. Final file is saved to `apps/[AppName]-app.html` (derived from app name, kebab-cased).

### Step 4 — How to give good feedback during the build

- **Be specific about interactions:** "clicking a row should open a detail panel" beats "make it more interactive"
- **Name the page:** "on the Alerts page, the status filter isn't working" not "the filter is broken"
- **Approve explicitly:** say "looks good, continue" or "approved" — the agent will not move on until you do
- If something looks wrong, say so before approving — rebuilding a page costs more than reviewing it

---

## Verify Before Delivering

- [ ] `--brand-*` vars unchanged
- [ ] OneNexus logo `<img>` intact
- [ ] Chat panel markup unchanged
- [ ] All 3 `@keyframes aiGlow*` present
- [ ] `.artifact-pointer` used (not plain `<a>`)
- [ ] `typewriterMessages` updated with domain prompts
- [ ] No duplicate JS functions
- [ ] `nav-components` removed from delivered app
- [ ] Every interaction from Build Plan is implemented (no "coming soon" stubs)

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

Patch only what changes — don't regenerate the whole file:
- *"Update the data integration list to include [X]"*
- *"Change the user persona to [Y]"*
- *"Rename the 'Exceptions' page to 'Flags'"*
- *"Wire up the row click on the Alerts table"*
