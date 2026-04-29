# worklog v0.5.36 — 2026-04-29

## 요약

`src/app/projects/eum/_components/sectionReference.js`에 누적되어 있던 `react/no-unescaped-entities` 에러 3건 정리. 영문 소유격 아포스트로피를 ASCII 직선 따옴표 `'`에서 굽은 따옴표 `&rsquo;`(U+2019)로 교체.

## 컨텍스트

- 이번 세션 내내 `npm run lint` 출력에 동일한 3건의 에러가 잔존: 라인 34, 161, 193.
- 모두 본 작업과 무관한 사전 존재 문제여서 수정을 유보하던 차, 사용자가 정리 요청.

## 변경 사항

`src/app/projects/eum/_components/sectionReference.js`:

| 라인 | 변경 전 | 변경 후 |
|------|---------|---------|
| 34   | `Opening Pandora's box` | `Opening Pandora&rsquo;s box` |
| 161  | `O'Reilly Media` | `O&rsquo;Reilly Media` |
| 193  | `physicians' cognitive load` | `physicians&rsquo; cognitive load` |

세 곳 모두 영문 소유격이라 `&apos;` / `&#39;`(직선) 대신 **`&rsquo;`**(굽은 따옴표)를 선택. 본문 가독성 + 타이포그래피 정합성 모두 우수.

## 검증

- `npm run lint` → 0 errors / 0 warnings.
- Reference 섹션 텍스트 자체 의미는 동일. 화면 렌더 시 `’` 형태로 표시.
