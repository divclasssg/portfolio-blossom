# worklog v0.5.39 — 2026-05-04

## 요약

오버레이 닫기(X) 버튼이 작고 화면 상단에 너무 붙어 있어 시인성이 떨어지는 문제 수정. 아이콘 크기와 헤더 상하 여백을 함께 키움.

## 변경 사항

### 아이콘 크기

| 파일 | 위치 | 이전 | 변경 |
|------|------|------|------|
| `src/_components/globalnav.js` | 오버레이 close 버튼 | `<IconClose size={24} />` | `<IconClose size={40} />` |
| `src/_components/localnav.js` | 오버레이 close 버튼 | `<IconClose size={24} />` | `<IconClose size={40} />` |

햄버거(`IconMenu`)는 그대로 24px 유지 — 본 요청 범위 밖.

### 오버레이 헤더 여백

| 파일 / 셀렉터 | 이전 | 변경 |
|----------------|------|------|
| `src/_style/_globalnav.scss` `.globalnav-overlay-header` | `height: var(--globalnav-height); padding: 0 var(--globalnav-padding-x);` | `padding: clamp(24px, 3.5vh, 48px) var(--globalnav-padding-x) clamp(12px, 2vh, 24px);` (height 제거) |
| `src/_style/_localnav.scss` `.localnav-overlay-header` | `height: var(--localnav-height); padding: 0 32px;` | `padding: clamp(24px, 3.5vh, 48px) 32px clamp(12px, 2vh, 24px);` (height 제거) |

`height` 고정값을 제거하고 padding으로 자연 확장. 결과적으로 헤더 높이는 ~76px ~ 112px 범위로 가변.

### 리스트 상단 오프셋 조정

헤더가 커져 리스트와 겹치지 않도록 buffer 증가:

| 파일 / 셀렉터 | 이전 | 변경 |
|----------------|------|------|
| `_globalnav.scss` `.globalnav-overlay-list` `padding-top` | `calc(var(--globalnav-height) + clamp(48px, 12vh, 160px))` | `calc(var(--globalnav-height) + clamp(72px, 14vh, 180px))` |
| `_localnav.scss` `.localnav-overlay-list` `padding-top` | `calc(var(--localnav-height) + clamp(48px, 12vh, 160px))` | `calc(var(--localnav-height) + clamp(72px, 14vh, 180px))` |

작은 뷰포트(320×568)에서도 리스트와 헤더 사이 ~40px 여백 확보.

## 검증

- `npm run lint`: 0 errors / 0 warnings.
- 브라우저 확인: X 버튼이 24px → 40px로 더 잘 보이고, 화면 상단에서 충분히 떨어진 위치에 배치됨 (사용자 확인 완료).
