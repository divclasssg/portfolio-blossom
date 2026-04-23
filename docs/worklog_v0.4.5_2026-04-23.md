# Worklog v0.4.5 — 2026-04-23

CLAUDE.md 아키텍처 섹션 추가·한국어 전환, `/liverpool` 경로를 별도 Vercel 프로젝트로 rewrite 연결.

## 1. CLAUDE.md 업데이트

- 기존: `@AGENTS.md` 참조만 존재
- 추가: 아키텍처 섹션 (렌더링 모델, 레이아웃 계층, 케이스 스터디 패턴, 스타일 아키텍처, 주요 컨벤션)
- 전체 내용을 한국어로 전환

## 2. `/liverpool` rewrite 연결

### `next.config.mjs`
- `rewrites()` 추가
  - `/liverpool` → `https://portfolio-tan-five-60.vercel.app/liverpool`
  - `/liverpool/:path*` → 하위 경로 전체 프록시
- 목적: `parkseik.com/liverpool`로 접근 시 별도 Vercel 프로젝트의 콘텐츠를 URL 변경 없이 표시
- 브라우저 URL은 `parkseik.com/liverpool`로 유지됨 (redirect가 아닌 rewrite)

## 참조 파일

- `CLAUDE.md`
- `next.config.mjs`
