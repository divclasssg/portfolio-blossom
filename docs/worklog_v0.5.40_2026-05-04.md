# worklog v0.5.40 — 2026-05-04

## 요약

`/about` 페이지 하단 프로필 영역의 resume 링크를 강조 스타일로 변경. 배경을 `--color-primary`, 텍스트를 `--color-white`로 두고 좌우 2px padding으로 배경이 살짝 보이도록 처리.

## 변경 사항

### `src/app/about/_style/about.style.scss`

`.my-profile div a` 셀렉터 신규 추가:

```scss
.my-profile {
    div {
        a {
            background: var(--color-primary);
            color: var(--color-white);
            padding: 0 2px;
        }
    }
}
```

같은 `div` 안의 `CopyEmailButton`은 `<button class="copy-email">`이라 영향 없음. resume `<a>`만 강조 적용.

## 검증

- `npm run lint`: 0 errors / 0 warnings.
- 브라우저 확인: resume 텍스트가 검정 배경 + 흰 글자, 좌우 2px 여백으로 가독성 확보.
