# Worklog v0.3.5 — 2026-04-15

## 변경 사항

### 1. Eum 프로젝트 `_references/` 문서 추가

#### `src/app/projects/eum/_references/`

Eum 프로젝트 참조 문서 4종을 저장소에 편입.

- `CLAUDE_data_hierarchy.md` — 데이터 계층 구조 정의
- `CLAUDE_legal_compliance.md` — 법적·규제 준수 가이드
- `CLAUDE_ux_writing.md` — UX 라이팅 가이드
- `COLOR_AUDIT.md` — 컬러 시스템 감사 기록

### 2. `.button-elevated` 그라데이션 톤 변경

#### `src/app/projects/eum/_style/_eum.buttons.scss`

- 기존: 초록(#48e770) → 핑크(#d985e4) → 시안(#00c0e8) 3색 무지개 그라데이션
- 변경: `--color-text-primary` (#1C1C1E) → `#0071E3` 2색 그라데이션 (94deg)
    - 브랜드 톤을 차분한 블랙→블루 전환으로 통일
    - 대체 후보 두 가지 주석 보존 (전체 먹선 3단계 / 단색 블루)

### 3. `.gitignore` 업데이트

#### `.gitignore`

- `.claude/worktrees/` 추가 — Claude Code 로컬 워크트리 산출물 제외

## 참조 파일

- `src/app/projects/eum/_style/_eum.buttons.scss`
- `src/app/projects/eum/_references/*.md`
- `.gitignore`
