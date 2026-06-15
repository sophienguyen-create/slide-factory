# Slide Factory

Turn a draft deck into a polished, Nexus Frontier–branded slide presentation.

## How to use

1. Open this folder in your AI IDE — it picks up `AGENTS.md` and `CLAUDE.md` automatically.
2. Drop your input draft into `specs/` — a `.pptx`, a markdown outline, or notes.
3. Type **"slide factory"** and name the input file — e.g. `specs/my-draft.pptx`. There may be
   several files in `specs/`; tell the agent which one to use.
4. The agent produces a **Build Plan** (a slide-by-slide map with brand notes) for your review.
5. Approve it. The agent builds the branded deck as one native `.pptx` and delivers it to `apps/`.

## Structure

```
specs/        ← drop input drafts here (.pptx, markdown, notes). Read on demand, not auto-indexed.
template/     ← brand-core.md (build-facing tokens + archetypes, the canonical version)
                + NFTLogo_Horizontal_FullColour.png + NFTLogo_Vertical_FullColour.png (logos)
docs/         ← nexus-frontier-brand-guidelines.md (full brand & design-system reference)
apps/         ← delivered branded decks (.pptx)
scripts/      ← git hooks and dev tooling
```

The brand is applied from two references:

- **`template/brand-core.md`** — the condensed, build-facing token set (colors, type scale,
  separators, the 5 layout archetypes, status pills, footer, logo rules). The single source of
  truth applied to every slide, and the canonical version stamp.
- **`docs/nexus-frontier-brand-guidelines.md`** — the full design-system reference. When the two
  disagree, the guidelines win and brand-core is updated to match.

See [CHANGELOG.md](CHANGELOG.md) for the current version and release history.

## First-time setup (after cloning)

Install the pre-commit hook to enforce version consistency:

```bash
cp scripts/pre-commit .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit
```

This blocks commits that change the brand-core or the guidelines without a matching version bump
(in `brand-core.md`) and a CHANGELOG entry.
