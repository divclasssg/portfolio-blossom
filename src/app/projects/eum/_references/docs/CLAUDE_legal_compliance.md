# Legal Compliance & Risk Management

> Hard constraints for this project. Do not suggest features, flows, or implementations that violate these rules.

---

## SaMD (Software as a Medical Device)

- Feature F13 is legally classified as SaMD under Korean Medical Device Act
- AI must never assert or imply a diagnosis — outputs are scoped to "AI 참고 키워드 (reference keywords)" only
- Live demo must use **pre-defined dummy data only** — no real patient data under any circumstance
- Project is not KFDA-approved; do not implement any flow that could constitute unauthorized medical practice

---

## Privacy & Data Protection

### Consent (PIPA Art. 22–23)
- Sensitive health data requires **separate explicit consent**, distinct from general personal data consent
- Cross-border API transfers (e.g., overseas LLM APIs) require an additional **separate consent step**
- Both consent flows must appear in onboarding screens **P-003** (general terms + personal data) and **P-009** (medical MyData + cross-border transfer)

### Zero Data Retention (ZDR)
- All external AI API contracts must enforce: **No Training + immediate deletion after processing**
- Patient data sent to external APIs must never be stored or used for model training

### MyData Compliance
- Architecture must assume physical/logical network separation requirements for 'General Recipients' (개인정보 보호법 시행령 제42조의3)
- Transmission logs must be stored separately for **3 years minimum**

### STT Audio — Critical
- Raw audio files must be **deleted immediately after transcription**
- Do not persist, cache, or log raw audio under any circumstance

### Data Retention Policy
| Trigger | Retention |
|---------|-----------|
| Account deletion | Immediate purge |
| Medical Act standard | 5 years |
| PIPA standard | 3 years |

---

## Gen-AI Guidelines (KFDA)

Following KFDA 「생성형 인공지능 의료기기 허가·심사 가이드라인」:

- Doctor dashboard must **permanently display** (non-dismissable):
  1. AI hallucination possibility warning
  2. Obligation for clinician's systematic review
  3. Foundation model version in use
- Do not replace these with toasts, tooltips, or any dismissable UI pattern

---

## Legal Disclaimer (Portfolio Project)

- This software is for **personal portfolio and research purposes only**
- It is NOT a licensed medical device under Korean Medical Device Act
- AI outputs must not be used for diagnosis, treatment, or prevention of any disease
- Developer assumes no legal liability for decisions made based on system output
