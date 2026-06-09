# Agent Trace & Tool-Call Components — Spec

Portable component spec for the **Tool Call Block** and **Activity Trace Group**
patterns. Self-contained: token values are inlined so this can move into a
separate design system that doesn't share these CSS variables.

Origin: Ace conversational UI (Ops.AI). Reference implementation lives in
`frontend/src/pages/AcePage.tsx` (`TraceGroup`, `buildUnits`) and
`frontend/src/index.css` (`.panel-bubble-tool`, `.trace-*`).

---

## Token glossary (used by both)

| Token | Value | Role |
|---|---|---|
| `--surface-2` | `#F4F4F5` | recessed block background |
| `--border-strong` | `#D4D4D8` | tool-block left rail |
| `--border-subtle` | `#F1F5F9` | trace-list left rail |
| `--brand-primary` | `#2D7575` | `TOOL` tag color |
| `--text-1` | `#0F172A` | toggle hover text |
| `--text-2` | `#475569` | tool / trace body text |
| `--text-3` | `#94A3B8` | toggle default + peek text |
| `--radius-sm` | `8px` | block corner radius |
| mono stack | `ui-monospace, 'SFMono-Regular', 'Menlo', monospace` | tool text |

---

## Component 1 — Tool Call Block

**Purpose:** render a single agent tool/system call (a query, an MCP call, an
extraction step) as a distinct, machine-flavored line inside a conversation or
activity stream. Visually subordinate to prose; reads as "the system did X."

### Anatomy
- Container — recessed block with a left accent rail
- `TOOL` tag — uppercase, brand-colored, leading
- Body text — monospace; may contain inline emphasis / HTML

### Requirements
- Monospace body, 11px / line-height 1.6, color `--text-2`.
- Recessed fill `--surface-2`, radius `--radius-sm`, **2px left rail** in
  `--border-strong` (the "this is tooling, not prose" signal).
- Padding `7px 10px`; vertical margin `2px 0`.
- `TOOL` tag: 600 weight, `--brand-primary`, letter-spacing `0.04em`, `6px`
  right margin, inline.
- Block-level (full width of its column), not inline — one call per block.
- Tag label is configurable (`TOOL`, `MCP`, `SQL`, …) but always short + uppercase.
- When nested inside a Trace Group, body shrinks to 10.5px and margin tightens to `1px 0`.

### States
Static only — no hover/interactive state. It is an output record.

### Reference CSS
```css
.tool-call {
  background: var(--surface-2);
  border-radius: var(--radius-sm);
  border-left: 2px solid var(--border-strong);
  padding: 7px 10px; margin: 2px 0;
  font-family: ui-monospace, 'SFMono-Regular', 'Menlo', monospace;
  font-size: 11px; color: var(--text-2); line-height: 1.6;
}
.tool-call .tool-tag {
  display: inline-block; font-weight: 600; color: var(--brand-primary);
  letter-spacing: 0.04em; margin-right: 6px;
}
```

### Markup
```html
<div class="tool-call">
  <span class="tool-tag">TOOL</span>Applying eligibility rules: holder of record, min quantity…
</div>
```

---

## Component 2 — Activity Trace Group

**Purpose:** collapse a run of intermediate agent steps (tool calls, system
calls, reasoning lines) into one compact, indented, expandable cluster — so a
long agent process reads as a clean spine of milestones with the detail tucked
away on demand.

### Anatomy
- **Avatar gutter** (32px) — avatar shown only on the first agent unit of a run;
  otherwise an empty spacer keeps alignment.
- **Toggle row** (`.trace-toggle`): chevron + label + optional peek
  - Chevron (12px, rotates 90° when open)
  - Label: `Hide activity` (open) / `N steps` (collapsed)
  - Peek (collapsed only): `· <last step text>`, truncated with ellipsis
- **List** (`.trace-list`, rendered only when open): vertical stack of trace
  lines behind a 1px left rail
  - Trace line: 11.5px, `--text-2`, line-height 1.5 (may contain a Tool Call Block)

### Behavior requirements
1. **Grouping** — consecutive same-author "trace" items collapse into one group;
   non-trace messages (the `✓` milestones) stay as normal lines and form the
   visible spine.
2. **Auto-expand while live** — the group that is currently streaming (the latest
   unit) is expanded by default.
3. **Auto-collapse on completion** — when a later item arrives (its milestone or
   the next group), the group collapses to `› N steps · <last step>`.
4. **Manual override** — clicking toggles; once the user clicks, their choice
   sticks (overrides the auto behavior) for that group.
5. **Suppress chrome inside** — no per-line timestamps or copy actions inside a
   trace group; it is a detail view, not individual messages.
6. **Indentation** — the list rail sits ~12px past the milestone text edge, so
   trace detail reads as a child of the spine.

### Sizing / tokens
- Toggle: 11px, `--text-3`; hover → `--text-1` (chevron → `--text-2`).
- Chevron rotation `0° → 90°` on open, 120ms ease.
- List: `margin-top 4px`, `padding-left 12px`, `1px` left rail in
  `--border-subtle`, items `gap 3px`.

### Accessibility
- Toggle is a real `<button>`.
- Label conveys state ("Hide activity" / "N steps"); peek text is decorative
  (truncated).
- Add `aria-expanded={open}` to the button. (The original shipped version relied
  on label text alone — set `aria-expanded` in any re-implementation.)

### Reference CSS
```css
.trace-toggle {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 11px; color: var(--text-3);
  background: transparent; border: none; cursor: pointer;
  padding: 2px 0; line-height: 1.3; max-width: 100%;
  transition: color 120ms ease;
}
.trace-toggle:hover { color: var(--text-1); }
.trace-toggle:hover .trace-chevron { color: var(--text-2); }
.trace-chevron { color: var(--text-3); flex-shrink: 0; transition: transform 120ms ease, color 120ms ease; }
.trace-chevron.is-open { transform: rotate(90deg); }
.trace-toggle-peek {
  color: var(--text-3); font-weight: 400; min-width: 0;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.trace-list {
  margin-top: 4px; padding-left: 12px;
  border-left: 1px solid var(--border-subtle);
  display: flex; flex-direction: column; gap: 3px;
}
.trace-line { font-size: 11.5px; color: var(--text-2); line-height: 1.5; }
.trace-line .tool-call { margin: 1px 0; font-size: 10.5px; }  /* nested tool block */
```

### State model (for re-implementation)
```
open          = userToggled ?? isLatestUnit
collapsedLabel = `${count} step${count > 1 ? 's' : ''}` + ` · ${stripHtml(lastItem)}`
expandedLabel  = "Hide activity"
```

### Markup (collapsed / expanded)
```html
<!-- collapsed -->
<div class="trace-group">
  <button class="trace-toggle" aria-expanded="false">
    <svg class="trace-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
    <span>5 steps</span>
    <span class="trace-toggle-peek">· Calling Security Master via MCP gateway</span>
  </button>
</div>

<!-- expanded -->
<div class="trace-group">
  <button class="trace-toggle" aria-expanded="true">
    <svg class="trace-chevron is-open" …><path d="m9 18 6-6-6-6" /></svg>
    <span>Hide activity</span>
  </button>
  <div class="trace-list">
    <div class="trace-line">Parsing incoming email from Sarah Smith…</div>
    <div class="trace-line"><div class="tool-call"><span class="tool-tag">TOOL</span>Intent: tender offer eligibility</div></div>
    <!-- … -->
  </div>
</div>
```

---

## Companion — "thinking" indicator

Often paired with a live trace group while the agent is mid-step.

- Three dots, 6px, `--text-3`, staggered pulse (delays `0.18s` / `0.36s`).
- 1.2s `thinkingPulse`: opacity `0.25 → 1`, scale `0.8 → 1`.

```css
.thinking-dots { display: inline-flex; align-items: center; gap: 4px; padding: 6px 0; }
.thinking-dots span { width: 6px; height: 6px; border-radius: 50%; background: var(--text-3); animation: thinkingPulse 1.2s ease-in-out infinite; }
.thinking-dots span:nth-child(2) { animation-delay: 0.18s; }
.thinking-dots span:nth-child(3) { animation-delay: 0.36s; }
@keyframes thinkingPulse { 0%, 80%, 100% { opacity: 0.25; transform: scale(0.8); } 40% { opacity: 1; transform: scale(1); } }
```
