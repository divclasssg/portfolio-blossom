# Bridge – Project Context for AI Assistants

## What is Bridge?

Bridge is a clinical decision support platform that connects the full care journey — from patient symptom logging to physician clinical reasoning to post-visit follow-up — without interruption (End-to-End).

- **Doctor-side**: Web SaaS dashboard (floating overlay panel on EMR, 480px 기본 / 480–1280px resizable)
- **Patient-side**: iOS/Android mobile app
- **Stage**: MVP

---

## Core Design Principles

All UI/UX decisions follow **Cognitive Load Theory** and **Distributed Cognition**.

- **Mental Model Alignment**: Redesign around physicians' actual diagnostic flow (event timeline), not EMR-style symptom lists
- **Progressive Disclosure**: Data is tiered into 3 levels
  - L1 (immediate): Allergies (pinned), Chief Complaint, AI risk signals
  - L2 (context): Chronic conditions, symptom NRS timeline, AI reference keywords
  - L3 (deep dive): Wearable graphs (HR, BP, sleep) via F12 floating window
- **Automation Bias Prevention**: AI outputs are positioned as mid-step hypotheses ("reference keywords"), never final diagnoses

---

## Key Features (MVP Scope)

| ID | Feature | Notes |
|----|---------|-------|
| F12 | Symptom Timeline | Floating panel → Separate floating window (2/3 screen, no triple overlay) |
| F13 | AI Reference Keywords | Downscoped from "disease suggestion" for SaMD compliance |
| F17 | Medical Term Simplifier | Converts clinical language to plain Korean for patients |
| P-019 | Symptom Intensity Input | Redundant coding: text + emoji + color gradient |

---

## Data Visualization Rules

Panel constraint: **480px 기본 (480–1280px resizable)**. Follow data-ink ratio principles strictly.

- **Heart rate**: Box-and-whisker (short range) → moving average (3-month, anti-overplotting)
- **Blood pressure**: Dot + pulse pressure color band — no line interpolation (prevents false continuity)
- **Reference range**: Shaded gray background box only; no border, no dense grid
- **Data provenance**: Solid icon badges juxtaposed with data points (patient input / wearable / public data)
- **Color encoding**: Never use color alone — always pair with icon + text label (color vision deficiency support). See `CLAUDE_data_hierarchy.md` Color Palette section for HEX tokens.

---

## Compliance Constraints

> These are hard constraints. Do not suggest features or flows that violate them.

- **SaMD scope**: AI must not assert diagnoses. Use "AI 참고 키워드" (reference keywords) only. Hallucination warning banner must be non-dismissable.
- **STT audio**: Raw audio files must be deleted immediately after transcription. Never persist.
- **Consent**: Separate explicit consent required for (1) sensitive health data and (2) cross-border API transfer (PIPA Art. 22–23). Both in onboarding (P-003, P-009).
- **Data retention**: Per Medical Act = 5 years; per PIPA = 3 years; on account deletion = immediate purge.
- **ZDR**: External AI API contracts must include No Training + immediate deletion clauses.
- **Demo mode**: Live demo uses pre-defined dummy data only. No real patient data.

---

## Accessibility Requirements

- All badges and alerts: icon + text label required alongside color (no color-only signaling)
- Symptom intensity (P-019): triple encoding — text + face icon + color (4단계 HEX: #548235 → #FFC000 → #E69F00 → #C00000, `CLAUDE_data_hierarchy.md` 참조)
- Charts: provide `sr-only` text alternative and hidden table for screen readers

---

---

## Document Hierarchy for Wireframe Development

### Primary Source (Reference Basis)

**Sketch PDFs** — Authoritative wireframe source. All design decisions grounded in these documents:
- `04_wireframe/sketch/onboarding.pdf` (16 pages) — Onboarding + Patient app flow
- `04_wireframe/sketch/Paient.pdf` (6 pages) — Patient screens
- `04_wireframe/sketch/Doctor.pdf` (2 pages) — Doctor dashboard panel

### Reference Materials (Contextual)

| Document | Role | Usage |
|---|---|---|
| `Bridge_Wireframe_Session_Summary.md` | UX decisions logged from prior sessions | Confirms layout choices, feature deferred to Future |
| `03_develop/06_Screen_Specification/05_Screen_Specification_v2.3.csv` | Feature ID mapping + data specs | Component names, field definitions |
| `CLAUDE_legal_compliance.md` | Regulatory + compliance constraints | Mandatory warnings, consent screens, data retention |
| `CLAUDE_data_hierarchy.md` | Data structure rules | Field relationships, data classification |

### Wireframe Enhancement Rules

1. **Sketch PDFs are ground truth** — If sketch shows it, it is included unless explicitly superseded by MVP scope
2. **Gap filling allowed** — Add intermediate screens if sketch flow is incomplete or narrative discontinuous
3. **Feature deference respected** — Features marked "Future" in Session Summary are not in MVP wireframes
4. **Compliance integration required** — All screens respect legal constraints; warnings are non-dismissable and permanent

---

## Architecture Notes

- EMR overlay: OS-level Always-on-Top floating panel
- F12 expansion: Separate floating window (2/3 screen) to minimize EMR occlusion
- Clinical note autosave: real-time with feedback UI
- Timeline (F12) trigger: background dim applied to prevent context loss
