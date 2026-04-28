# worklog v0.5.18 — 2026-04-28

## 요약

이력서 PDF 다운로드 자산을 추가하고, About / Localfooter의 `resume` 링크를 새 탭에서 열리는 PDF 뷰어 링크로 교체. 풀스크린 오버레이 메뉴를 단일 `projects` 항목 → 진행 중인 3개 프로젝트(eum / cronometer / liverpool fc)로 분리.

## 변경 사항

### `public/download/resume_parkseik.pdf` (신규)

- 이력서 PDF 자산 (`66KB → 70KB`, exiftool로 메타데이터 보정 후 크기 변경)
- PDF Title 메타데이터를 `Resume - PARK Seik`로 설정 (`exiftool -Title=...`)
  - 기본값으로 박혀있던 `문서1` 제거 → 새 탭으로 열었을 때 브라우저 탭 제목이 의미 있는 문자열로 표시되게 함

### `src/app/about/page.js`

- About 푸터의 resume 링크 변경
  - 기존: `<a href="/" download>resume</a>` (홈으로 이동하던 placeholder)
  - 신규: `<a href="/download/resume_parkseik.pdf" target="_blank" rel="noopener noreferrer">resume`
- 새 탭에서 PDF 뷰어로 열림 (download 속성 제거)
- 부수: 일부 줄 들여쓰기/줄바꿈 정리 (포맷터 적용)

### `src/app/projects/_components/localfooter.js`

- 케이스 스터디 페이지 푸터의 resume 링크도 동일하게 교체
  - About 페이지와 동일한 `/download/resume_parkseik.pdf` + `target="_blank"` 패턴

### `src/_components/globalnav.js`

- `MENU_ITEMS` 항목 분리
  - 기존: `projects` 단일 항목 (`/projects`)
  - 신규: `eum, 2026 ` / `cronometer, 2025 -- 2026 ` / `liverpool fc, 2025 ` 3개 항목으로 분리
- 각 항목의 `match` 함수는 해당 케이스 스터디 경로(`/projects/eum` 등)로 startsWith 매칭
- 풀스크린 오버레이에 진행 중 프로젝트 라인업이 그대로 노출되도록 함

## 동작

| 위치 | 클릭 동작 |
|---|---|
| About 푸터 `resume` | 새 탭에서 `Resume - PARK Seik` 제목으로 PDF 뷰어 표시 |
| 케이스 스터디 푸터 `resume` | 동일 |
| 풀스크린 오버레이 메뉴 | home / about / eum / cronometer / liverpool fc 5개 항목으로 분기 |

## 검증

- `public/download/resume_parkseik.pdf` 직접 접근 → PDF 정상 로드, 탭 제목 `Resume - PARK Seik` 확인
- About / 케이스 스터디 푸터의 `resume` 클릭 → 새 탭에서 PDF 열림 (현재 페이지 그대로 유지)
- 햄버거 메뉴 → eum / cronometer / liverpool fc 항목 클릭 시 각 프로젝트 페이지로 이동
- 활성 항목 `aria-current="page"` 적용 유지

## 메모

- `cronometer`는 라우트 `/projects/cronometer`가 아직 생성되지 않은 상태 (메뉴만 노출). 페이지 추가 시 자동으로 active 매칭 동작.
- PDF 메타데이터 수정에 사용한 도구: `exiftool` (Homebrew 설치). `_original` 백업본은 작업 후 삭제.
