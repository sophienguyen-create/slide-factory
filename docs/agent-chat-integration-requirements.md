# Requirements: bake live agent chat + Markdown rendering into the scaffold

**Goal:** every demo the scaffold builds should ship with a chat that (1) talks to the real
portal agent service instead of the canned mock, and (2) renders the agent's Markdown replies
(tables, headings, lists) as formatted HTML. Today each delivered demo needs both patched by
hand after build — this moves them into the shared `template/` core so new demos get them free.

**Repo:** `onx-scaffold` (this repo). All edits are in `template/` + `docs/`.

**Reference implementation (already shipped + verified in production):** the OneNexus Lab Portal
copied a scaffold demo and patched it. Copy the working code from there:
- `../onx-lab-portal/public/nexus-app-demo-credit-mis/index.html` — the live, verified chat
  (`streamMakotoReply`, `renderMarkdown`, `.chat-md` CSS, the marked/DOMPurify `<script>` tags).
- `../onx-lab-portal/docs/embedding-an-agent.md` — the `/api/agent/chat` request/response
  contract (the endpoint is provided by the host portal; the scaffold is just the client).

---

## Background: how the scaffold assembles a demo

- `template/core.js` (~750 lines) — shared JS: `sendMessage()` (~L190), `sendHomeMessage()`
  (~L561), `appendHtml()`, `aiTurnMarkup()`, `aiThinkingMarkup()`, `userTurnMarkup()`, the
  typewriter (`window.ONX_TYPEWRITER`, ~L365). **The mock lives here** — both send paths emit a
  hardcoded `"...this is a UI prototype — agent logic is in development."` (L208 + L579).
- `template/core.css` (~1484 lines) — shared styles. **Holds the canonical version stamp** (L2,
  `v4.1.0`). `.chat-md` styles go here.
- `template/layout-shell.html` (~1501 lines) — the HTML shell. `<head>` CDN scripts at L30-32
  (Tailwind, lucide); the per-app `window.ONX_TYPEWRITER` inline config at ~L1468.
- Build step inlines `core.css` + `core.js` into each `apps/*.html` as a single self-contained
  file (see README). So changing the templates propagates to **newly built** demos only.

---

## Design decision (important — the scaffold is NOT always portal-hosted)

The mock exists because a standalone demo (opened from `file://` or any host without the portal
backend) has no `/api/agent/chat`. The scaffold must handle both:

- **Portal-hosted** (the normal deploy target): call the real endpoint, stream, render Markdown.
- **Standalone** (offline UI preview): the endpoint 404s / network-fails → **graceful fallback**,
  never a broken chat.

Make it config-driven, mirroring the existing `ONX_TYPEWRITER` pattern. Add an optional inline
config read by core.js:

```js
// optional, set in an inline <script> before core.js (per app)
window.ONX_AGENT_CHAT = {
  app: 'nexus-app-demo-credit-mis', // slug registered in the portal (/admin/apps); omit → Bill
  endpoint: '/api/agent/chat',      // default; override only if needed
  mock: false                       // true → keep the canned UI-prototype reply (offline design previews)
};
```

Behavior:
- `mock: true` → keep today's canned reply (for pure-UI demos with no backend).
- otherwise → POST to `endpoint`, stream the reply, render Markdown on completion.
- On `401/403` → "Please sign in…" / "assistant isn't enabled here"; on `404`/network/`5xx` →
  a short honest "couldn't reach the assistant" line. **Never** the old fake-answer mock.

---

## File-by-file requirements

### 1. `template/core.js`

**1a. Add a shared streaming helper** (port `streamMakotoReply` from the portal copy, generalized
to read `window.ONX_AGENT_CHAT`). It assumes the caller already appended the user turn + a
`#typing-indicator`. Responsibilities: maintain a module-level history array, trim to the last 20
turns, POST `{ app, messages, stream:true }` to the endpoint, stream tokens into the bubble as
plain text, render Markdown on completion, map error statuses to friendly messages, fall back to
plain text / mock when unavailable.

**1b. Add `renderAgentMarkdown(el, md)`** (port `renderMarkdown` from the portal copy):
```js
function renderAgentMarkdown(el, md) {
  try {
    if (window.marked && window.DOMPurify) {
      el.innerHTML = window.DOMPurify.sanitize(window.marked.parse(md, { gfm: true, breaks: true }));
      el.style.whiteSpace = '';
      el.classList.add('chat-md');
      if (window.lucide) lucide.createIcons();
    }
  } catch { /* leave the streamed plain text in place */ }
}
```

**1c. Route both `sendMessage()` (L190) and `sendHomeMessage()` (L561) through the helper.** Delete
the `setTimeout(...)` mock blocks (the canned `aiBody` at L208 + L579). The streamed bubble must be
a **`<div ... style="white-space:pre-wrap">`** (NOT `<p>` — tables/headings/lists are invalid
inside `<p>`). Stream with `el.textContent = full`; on completion `renderAgentMarkdown(el, full)`.
Mark both functions `async`.

> ⚠️ Both send paths carry the mock — patch BOTH. (The portal demo missed one on the first pass.)

**1d. i18n: clickable prompts must submit the DISPLAYED (translated) text, never a hardcoded
string.** The scaffold's agent-page i18n (`translateAgentPage`) swaps visible text nodes on
language toggle, but it does **not** rewrite an `onclick="homePrompt('…literal…')"` argument. So a
suggestion pill whose label is translated to Japanese but whose handler passes a hardcoded English
prompt will **submit English and get an English reply** (this shipped to portal prod in v1.4.2 and
was fixed in v1.4.3). Wire every clickable prompt (home pills, suggestion chips) to submit its own
rendered label, e.g. `onclick="homePrompt(this.textContent.trim())"` — so the request (and thus the
reply language) always matches what the user sees. The agent must be grounded bilingually (per
ADR-021 / the EN+JA `DEFAULT_DATA`) for the localized prompt to get a localized answer. The in-chat
copilot quick-suggestions already do this correctly via `L(en, ja)` — copy that discipline.

### 2. `template/core.css`

Add the scoped `.chat-md` block (copy verbatim from the portal copy's `<style>`). Critical lines —
**Tailwind's CDN preflight resets these**, so they must be re-declared or bullets/headings vanish:
```css
.chat-md ul { list-style: disc;    margin: 0.4em 0; padding-left: 1.25em; }
.chat-md ol { list-style: decimal; margin: 0.4em 0; padding-left: 1.25em; }
.chat-md h1 { font-size: 1.05rem; font-weight: 700; … }
.chat-md h2 { … } .chat-md h3 { … }
.chat-md table { border-collapse: collapse; width: 100%; … }
.chat-md th, .chat-md td { border: 1px solid var(--border-subtle, var(--border)); padding: 0.35em 0.6em; … }
```
Use the existing core.css design tokens (`--text-1/2`, `--border`, `--border-subtle`,
`--surface-2`, `--onx-teal`) so tables/headings stay on-brand.

**Bump the version stamp** at L2 (e.g. `v4.1.0` → `v4.2.0` — new capability = minor).

### 3. `template/layout-shell.html`

- Add the two CDN libs in `<head>` after the lucide script (after L31):
  ```html
  <script src="https://cdn.jsdelivr.net/npm/marked@12/marked.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/dompurify@3/dist/purify.min.js"></script>
  ```
- Next to the `window.ONX_TYPEWRITER` inline config (~L1468), add a commented `window.ONX_AGENT_CHAT`
  example so each new demo knows where to set its slug.

### 4. `docs/design-system.html`

Document the new behavior next to the existing `ONX_TYPEWRITER` docs:
- The chat is live by default (POSTs to `/api/agent/chat`); set `window.ONX_AGENT_CHAT = { app: '<slug>' }`.
- The slug must be registered + enabled for the org in the portal (`/admin/apps` + `/admin/orgs`),
  and the org needs the `agent` feature. Link to the portal's `docs/embedding-an-agent.md`.
- Replies render as Markdown via `marked` + `DOMPurify` into `.chat-md`; `mock: true` for offline previews.

### 5. `CHANGELOG.md` + version

Add a `## v4.2.0` entry: "Live agent chat (replaces the mock; configurable via
`window.ONX_AGENT_CHAT`) + Markdown rendering of replies (marked + DOMPurify, `.chat-md`)." Keep
the core.css stamp and CHANGELOG version in sync.

### 6. Delivered apps in `apps/` (decide, don't silently skip)

`apps/*.html` are already-built, inlined copies — they will **not** auto-update. Options to state
in the PR: (a) leave them (per-client deliverables, regenerated on demand), or (b) rebuild/re-inline
them from the new core. Note: `apps/Credit-Risk-MIS-app.html` here still has the mock, but the
**portal already ships its own patched copy** — don't assume editing it updates production.

---

## Security

- **DOMPurify is mandatory** — the reply is LLM output and a prompt-injected `<script>`/`onerror`
  could otherwise execute. Never `innerHTML = marked.parse(...)` without sanitizing.
- If any host adds a Content-Security-Policy, allow `cdn.jsdelivr.net` in `script-src` (and keep
  the graceful fallback so a blocked CDN degrades to plain text, not a broken chat).

---

## Acceptance criteria / verification

1. `node --check` passes on the assembled demo's inline scripts (extract `<script>` blocks; the
   portal verified this way).
2. With `window.ONX_AGENT_CHAT.mock = true` (or no backend): chat shows the graceful fallback, no
   raw JS errors, demo still usable.
3. Portal-hosted (real endpoint): a reply containing a Markdown table renders a real `<table>`
   (with `<th>`), an `<h1>`, bulleted (`disc`) + numbered (`decimal`) lists, and **no `<script>`**
   survives sanitization. Verify in a browser (load the demo, render a sample through
   `renderAgentMarkdown`, assert `querySelector('table')` and `querySelector('script') === null`).
4. Both `sendMessage` and `sendHomeMessage` (input box AND welcome-screen prompt pills) hit the
   real agent — grep the built file for the old canned string → 0 matches.
5. i18n: toggle to a non-English language, click each suggestion pill → the submitted prompt AND
   the reply are in that language (not English). Grep the built file: no
   `onclick="homePrompt('…')"` / `onclick="sendMessage('…')"` with a hardcoded string literal.
6. core.css version stamp == CHANGELOG top version.

---

## Suggested new-session kickoff

Open a session in `onx-scaffold` and start with:
> Read `docs/agent-chat-integration-requirements.md` and implement it. The working reference is in
> the sibling repo `../onx-lab-portal/public/nexus-app-demo-credit-mis/index.html` (+ its
> `docs/embedding-an-agent.md` for the `/api/agent/chat` contract). Port the live-chat wiring and
> Markdown rendering into `template/core.js` + `template/core.css` + `template/layout-shell.html`,
> make it config-driven via `window.ONX_AGENT_CHAT` with a graceful standalone fallback, bump the
> core.css version + CHANGELOG, and document it in `docs/design-system.html`.
