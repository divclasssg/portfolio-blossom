# worklog v0.5.22 — 2026-04-28

## 요약

홈/오버레이 메뉴/케이스 스터디 푸터의 프로젝트 라벨에서 연도 표기를 제거. `eum, 2026` → `eum` 식으로 단순화.

## 변경 사항

### `src/_components/globalnav.js`

오버레이 메뉴의 `MENU_ITEMS` 라벨에서 연도 제거:
- `eum, 2026 ` → `eum`
- `cronometer, 2025 -- 2026 ` → `cronometer`
- `liverpool fc, 2025 ` → `liverpool fc`

### `src/_components/home-portfolio.js`

홈 프로젝트 카드 라벨에서 연도 제거:
- `eum, 2026` → `eum`
- `cronometer, 2025 -- 2026` → `cronometer`
- `liverpool fc, 2025` → `liverpool fc`

부수: prettier 줄바꿈 정리 (`<Link>` props 한 줄 정리, `videoSrc1x` 줄바꿈 처리, `poster` 삼항식 한 줄로).

### `src/app/projects/_components/localfooter.js`

케이스 스터디 푸터 프로젝트 링크에서 연도 제거:
- `eum, 2026` → `eum`
- `cronometer, 2025 -- 2026` → `cronometer`
- `liverpool fc, 2025` → `liverpool fc`

## 동작

| 위치 | 변경 전 | 변경 후 |
|---|---|---|
| 홈 프로젝트 카드 | `eum, 2026` | `eum` |
| 오버레이 메뉴 | `cronometer, 2025 -- 2026` | `cronometer` |
| 케이스 스터디 푸터 nav | `liverpool fc, 2025` | `liverpool fc` |

## 검증

- `grep -rn "2025 -- 2026" src/` → 결과 0건 (이전 커밋 v0.5.21에 이어 cronometer 라벨까지 정리)
- 홈 / about / 케이스 스터디에서 모든 프로젝트 라벨 단일어로 표시 확인
- 라우팅 / hover 영상 / aria-current 모두 그대로 동작 (label 텍스트만 변경)
