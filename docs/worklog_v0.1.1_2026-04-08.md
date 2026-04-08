# Worklog v0.1.1

- **버전**: 0.1.1
- **날짜**: 2026-04-08
- **이전 버전**: v0.1.0
- **프로젝트**: portfolio (Next.js 16 + React 19 + Sass)

---

## 변경 사항

### .gitignore 보강

프로젝트 루트의 `.gitignore`에 다음 항목 추가:

- **IDE / 에디터**
    - `.vscode/`
    - `.idea/`
    - `*.swp`, `*.swo`
- **OS 시스템 파일**
    - `Thumbs.db`
    - `Desktop.ini`
    - `ehthumbs.db`
- **로그**
    - `*.log`
- **기타 임시 파일**
    - `*.bak`, `*.tmp`
    - `.cache/`

### Claude Code 설정 처리

- `.claude/` 전체 무시를 고려했으나, 혹시 모를 공용 설정 보존을 위해 기존대로 **`.claude/settings.local.json`만 무시**로 유지

---

## 다음 작업 후보 (변경 없음)

- 전역 스타일 엔트리 (`globals.scss`) 구성 및 `layout.js` import
- 변수/믹스인 파일 (`_variables.scss`, `_mixins.scss`)
- 반응형 breakpoint 정의
- 컴포넌트/섹션 폴더 구조
- metadata placeholder 값 교체
