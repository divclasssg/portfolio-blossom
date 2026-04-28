# worklog v0.5.19 — 2026-04-28

## 요약

`parkseik.com/liverpoolfc` 404 정상화 (cross-repo basePath 적용). eum SectionReference의 학술 인용 표기를 APA 표준으로 정리. `.claude/scheduled_tasks.lock` gitignore 추가.

## 변경 사항

### `parkseik.com/liverpoolfc` 프록시 정상화 (이 레포 코드 변경 없음)

- 진단:
  - 본 레포 `next.config.mjs:23-34`의 rewrite는 `/liverpoolfc/:path*` → `portfolio-tan-five-60.vercel.app/liverpoolfc/:path*` 로 destination 측 서브패스를 가정.
  - 그런데 destination(`divclasssg/portfolio` 레포)는 8b82955 커밋에서 basePath가 제거되어 콘텐츠가 루트(`/`)에서만 서빙되는 상태였음 → rewrite 매칭 실패로 항상 404.
- 단순히 destination을 루트(`/`)로 rewrite하면 destination HTML 안의 절대경로 에셋(`/_next/...`)이 본 도메인의 `_next` 네임스페이스와 충돌해 양쪽이 다 깨지므로 채택 불가.
- 채택 해법: destination 레포에 `basePath: "/liverpoolfc"` 재설정.
- 실행: destination 레포 `next.config.ts`에 한 줄 추가 후 푸시 (1f1de32). Vercel 자동 재배포 후 검증 완료.

### `src/app/projects/eum/_components/sectionReference.js`

- 15개 참고문헌의 APA 인용 포맷 정리.
  - 기존: 논문 제목 전체에 `<em>` 적용
  - 변경: APA 7판 표준에 맞춰 **저널명 + 권 번호**에만 `<em>` 적용 (논문 제목은 일반체)
- 동시에 줄바꿈/공백 정리 (`{" "}` 제거, 더 자연스러운 흐름).
- 기능 변경 없음, 표기 일관성 개선.

### `.gitignore`

- `.claude/scheduled_tasks.lock` 추가 — Claude Code 백그라운드 스케줄러의 로컬 락 파일이 untracked로 떠 있어 무시 처리.

## 검증

| URL | HTTP | 의미 |
|---|---|---|
| `https://portfolio-tan-five-60.vercel.app/` | 404 | basePath 적용 결과 (의도된 부수효과) |
| `https://portfolio-tan-five-60.vercel.app/liverpoolfc` | 200 | destination 정상 서빙 |
| `https://parkseik.com/liverpoolfc` | 200 | rewrite 프록시 정상 |

- destination 로컬 빌드(`npm run build`) 통과, `_next` 에셋 모두 `/liverpoolfc/_next/...` 형태로 prefix 확인.
- 본 레포 코드 변경 없으므로 회귀 위험 없음.

## 참고

- destination 레포: `https://github.com/divclasssg/portfolio.git` (master 브랜치, 1f1de32)
- 본 레포 rewrite는 그대로 유지 (`next.config.mjs:23-34`)
- `parkseik.com/liverpoolfc` 케이스 스터디 페이지(`/projects/liverpoolfc`)와 LFC 클론 페이지(`/liverpoolfc`)는 서로 다른 콘텐츠로 공존.
