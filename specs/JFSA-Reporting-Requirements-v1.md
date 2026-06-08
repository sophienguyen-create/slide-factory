# Requirements — JFSA Quarterly Submission Platform

**Product:** OneNexus — Credit Risk MIS / Regulatory Reporting
**Audience:** Credit Policy & Planning Department (信用企画部 / CPPD), client bank
**Purpose:** Add a small, high-value set of features to the existing demo so it reflects how a quarterly JFSA credit-risk submission is actually run — enough to show domain understanding and value, without over-building.
**Implementation target:** Single-file app `credit-risk-mis-demo.html` (the current demo). Each requirement below names where it slots into the existing structure so it can be implemented directly with Claude Code.

---

## 1. Context — what we are solving

The bank's CPPD compiles a quarterly credit-risk submission to the JFSA (with overlap to BOJ data collection). The current demo already models the hardest parts well: source feeds and lineage, validation, GL reconciliation, aggregation with maker-checker (four-eyes), stress scenarios, the ringi seal chain across three lines of defence, the risk register, and an embedded AI copilot.

What it does **not** yet show is the *quarter as a recurring cycle*: where the submission stands at a glance, why the numbers moved versus last quarter, what happens after filing (regulator questions), and the auditable evidence behind every figure. These are exactly the day-to-day pain points CPPD lives with. The five additions below close those gaps.

**Principles for this build**

- Keep it light. These are demo-grade features, not a production system. Reuse data already in the app.
- Stay regime-level. Reference JFSA / Basel III / BCBS 239 broadly; do not hard-code a specific return form.
- Preserve what exists: bilingual EN/JA (every label via the existing `L(en, ja)` helper), the VPC-scoped / no-data-leaves-tenant framing, the teal OneNexus styling, and the AI copilot tie-ins.
- All figures are illustrative. Anchor to the existing demo data (MUFG-style group, FY2025 Q4, report `JFSA-CRE-FY25Q4`, owner S. Tateiri / CPPD, due 30 Jun 2026).

---

## 2. Existing structures to reuse

So that new features stay consistent and implementable, build on what's already defined in the file:

- **Top-level pages** via `showPage(id)` and `id="page-<id>"`: currently `MYPAGE` (placeholder), `data-sources`, `reports`, `settings`, plus the agent workspace.
- **Workflow stages** in `STAGES` (and `STAGE_JA`): `source → validation → aggregation → recon → portfolio → memo → approval → risk`, rendered by `setStage()` / `renderStage()`.
- **Data arrays:** `SECTIONS`, `FEEDS`, `VALCHECKS`, `APPROVALS`, `RISKS`, `RINGI`, `BREAKS`, `CHANGES`, `FIGS` (the figures: cet1, lcr, tlac, rwa, npl, etc.), `MEMO`, and the empty `AUDIT = []`.
- **Helpers:** `L(en, ja)` for bilingual text, `pill()`, `card()`, `toast()`, `glanceStat()`, the copilot answer router (`answerFor`).

---

## 3. Requirements (priority order)

Three **core** items give the strongest demo; two **secondary** items round out the story if time allows.

---

### R1 — Submission Cockpit (new home dashboard) · CORE

**Pain point.** CPPD has no single view of where the quarter stands. Status lives across spreadsheets, email and people's heads: which feeds are in, what's blocking sign-off, how many days to the JFSA deadline, whether ratios are above minima.

**What to build.** Replace the placeholder `MYPAGE` with a "Submission Cockpit" — the landing page for the report. A single screen that aggregates data already in the app:

- **Countdown & header:** report ID (`JFSA-CRE-FY25Q4`), owner, due date, days remaining, overall status (In progress / Ready to submit / Blocked).
- **Cycle progress bar** across the eight `STAGES`, showing the current stage and which are complete.
- **Readiness tiles** (reuse `glanceStat`): feeds in vs. expected (from `FEEDS`), open GL breaks (from `BREAKS`), pending four-eyes changes (from `CHANGES`), 1st-line confirmations outstanding (from `APPROVALS`), ringi seals outstanding (from `RINGI`), open risks (from `RISKS`).
- **"What's blocking submission" panel:** a live list of every item currently gating filing, each linking to the relevant stage (e.g. the PE-fund GL break → `recon`; Markets sign-off → `approval`). Reuse the same gating logic as `advanceRingi()` (`openBreaks()`, `pendingChanges()`, `pendingApprovals()`).
- **Key ratios strip:** CET1 / LCR / NSFR / TLAC vs. regulatory minima, each green/amber (reuse `FIGS` + threshold styling).

**Slots into.** `page-MYPAGE`; relabel the sidebar nav entry to "Cockpit" / 「コックピット」. Make it the default page on load (it currently restores via `localStorage`).

**Acceptance criteria.**
- Page renders entirely from existing arrays; no new data needed beyond a couple of constants (due date, expected-feed count).
- Every blocking item links through to the correct stage via `setStage()`.
- Tiles update if underlying state changes (e.g. applying a seal or clearing a break).
- Fully bilingual via `L()`.

---

### R2 — Quarter-over-Quarter Movement Commentary · CORE

**Pain point.** The single most common regulator and internal-audit question is *"why did this number move?"* Today analysts assemble movement explanations by hand in Excel/Word each quarter. It is slow, inconsistent, and the reasoning is not linked to the figure.

**What to build.** A structured movement-commentary layer on the key figures. For each headline figure in `SECTIONS` (start with capital/credit: RWA, CET1, NPL, EL, large exposures), store and display:

- prior-quarter value, current value, delta (absolute + %),
- a **driver** (short structured reason — e.g. "FX revaluation", "new origination", "model recalibration"; reuse / extend the existing `REASON_CODES`),
- a free-text commentary line, owner, and last-updated stamp.

Surface it two ways:
1. In the **aggregation** stage, an expandable "Movement vs. FY25 Q3" row under each figure.
2. In the **memo** stage, an auto-compiled "Movement commentary" section so the narrative the regulator reads is generated from the same structured data.

Add a copilot action: *"Draft the movement commentary"* / 「変動コメントを起草」 that pre-fills drivers and prose from the deltas (mirrors the existing AI memo-draft pattern), which the analyst then edits — keeping a human in the loop.

**Slots into.** New `MOVEMENTS` array keyed by figure id; render hooks in `stageAggregation()` and `stageMemo()`; new quick-action in `QK` for those stages and a branch in `answerFor`.

**Acceptance criteria.**
- Each covered figure shows prior value, delta, driver, commentary, owner.
- Memo movement section is generated from `MOVEMENTS`, not typed twice.
- AI-drafted commentary is clearly editable and marked as AI-assisted (reuse existing draft styling).
- Bilingual.

---

### R3 — Evidence Pack & Audit Trail · CORE

**Pain point.** Under BCBS 239, the bank must prove how every submitted number was derived — and JFSA / internal audit ask for this after the fact. The demo already traces lineage live, but the `AUDIT` array is empty and there is no consolidated, exportable record. CPPD currently reconstructs this manually from emails and screenshots.

**What to build.** Activate `AUDIT` as a running, timestamped log and add an exportable evidence pack:

- **Audit log:** append an entry whenever a material action occurs — figure edited (who, old→new, reason code), four-eyes approval, GL break opened/cleared, feed received, ringi seal applied, AI draft accepted. Hook into the functions that already perform these (`applyChange`, `advanceRingi`, sign-off handlers).
- **Evidence pack view:** a read-only, chronological, filterable list (by figure, by stage, by person). Each entry links back to the live trace where available.
- **Export action:** an "Export evidence pack" button (reuse the existing Export control) that assembles the audit log + final figures + sign-off chain into a single package. *Note: actual file download must be initiated by the user — implement as a generated preview / print view rather than an automatic download.*

**Slots into.** Surface in the **approval** stage and/or as a tab on the `reports` page. Reuse `AUDIT`; render with `card()` + `pill()`.

**Acceptance criteria.**
- At least figure-edits, seals, and break clear/open generate audit entries automatically.
- Evidence view is filterable and read-only.
- Export produces a self-contained, human-readable view (no auto-download; user triggers it).
- Bilingual; entries show both the actor and the timestamp.

---

### R4 — Regulator Query Log (JFSA hearing tracker) · SECONDARY

**Pain point.** After filing, JFSA sends follow-up questions (ヒアリング). Today these are tracked in email and Excel, disconnected from the figures they concern, with no view of what's outstanding or overdue.

**What to build.** A lightweight query tracker:

- A `QUERIES` list: question text, received date, JFSA reference, linked figure/section, owner, due date, status (Open / Drafting / Responded / Closed), response text.
- A simple board or table view with status pills and an overdue flag.
- Each query links to the relevant figure's trace/evidence so the response is grounded in the submitted number.
- Optional copilot action: *"Draft a response to this query"* using the figure's lineage and movement commentary.

**Slots into.** New feature on the `reports` page (tab) or a new nav entry "Regulator queries" / 「当局照会」. Reuse `card()`, `pill()`, status styling.

**Acceptance criteria.**
- Queries display with status, owner, due date, linked figure.
- Overdue queries are visually flagged.
- Drafted responses are editable and marked AI-assisted.
- Bilingual.

---

### R5 — Submission Archive & Resubmission · SECONDARY

**Pain point.** Reporting is a recurring cycle, but the demo shows only the current report. CPPD needs to see prior quarters, compare against them, and handle amended/resubmitted filings (a real and sensitive event).

**What to build.** Turn the `reports` page into a short archive:

- A list of submissions (e.g. FY25 Q2, Q3, current Q4) with status, submission date, and a version/amendment indicator.
- Open a past quarter read-only to view its final figures and sign-off chain.
- An "Amend / resubmit" affordance on a filed report that opens a new version, carries forward the prior figures, and requires a reason for amendment (feeds the audit trail in R3).

**Slots into.** `page-reports` (list + detail); reuse the existing report header component for each entry.

**Acceptance criteria.**
- At least two prior (read-only) quarters plus the live one are listed.
- Amendment flow records a reason and creates a new version without altering the original.
- Bilingual.

---

## 4. Out of scope (intentionally)

To keep the demo focused, the following are **not** included now and can be noted as roadmap: real e-filing/XBRL generation (the demo continues to hand off to the reporting engine of record, e.g. Adenza); live connections to source systems; user authentication / RBAC enforcement; production data retention; and any feature that writes data outside the tenant VPC.

---

## 5. Suggested build order

1. **R1 Cockpit** — highest demo impact, reuses existing data, no new workflow logic.
2. **R3 Evidence Pack / Audit Trail** — activate `AUDIT`; mostly hooks into existing actions.
3. **R2 Movement Commentary** — the "why did it move" story; strongest domain signal.
4. **R4 Regulator Query Log** — if time allows; novel and resonant with CPPD.
5. **R5 Archive & Resubmission** — rounds out the recurring-cycle narrative.

R1–R3 alone constitute a complete, compelling demo.

---

## 6. Demo narrative (how these features tell the value story)

Open on the **Cockpit (R1)** — "here is the whole quarter at a glance, and exactly what's blocking us." Click into a blocker to reach the existing reconciliation/approval flow. In **aggregation**, expand a figure to show **movement commentary (R2)** — "the regulator always asks why RWA moved; here it's structured and AI-drafted." Show the **evidence pack (R3)** — "and we can prove every number to JFSA and internal audit in one click." Then **R4/R5** close the loop: "after we file, here's how we handle JFSA's follow-up questions, and how we manage the next quarter and any amendment." Throughout, the AI copilot is the assistant doing the heavy lifting while CPPD stays in control.
