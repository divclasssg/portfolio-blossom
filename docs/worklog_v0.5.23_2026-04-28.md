# worklog v0.5.23 — 2026-04-28

## 요약

글로벌 네비/오버레이 메뉴를 1024px 중앙 정렬 컨테이너에서 페이지 padding(`--globalnav-padding-x`) 기준 풀-너비 정렬로 통일.

## 변경 사항

### `src/_style/_globalnav.scss`

`.is-sub` 전용 컨테이너 블록 제거:

```scss
&.is-sub {
    .globalnav-content {
        max-width: 1024px;
        padding: 0 32px;
        margin: 0 auto;
        box-sizing: border-box;
    }
}
```

`.globalnav-overlay .globalnav-overlay-list`에서 중앙 정렬 컨테이너 제거:

- `margin: 0 auto;` 삭제
- `max-width: 1024px;` 삭제

(`padding: 0 var(--globalnav-padding-x);`와 `box-sizing: border-box;`만 유지)

## 동작

| 위치 | 변경 전 | 변경 후 |
|---|---|---|
| 서브 페이지 globalnav 내부 정렬 | 1024px 컨테이너 + padding 32px, 좌우 auto margin | `--globalnav-padding-x`만 적용 (홈과 동일 정렬) |
| 풀스크린 오버레이 메뉴 항목 | 1024px 컨테이너 + auto margin | `--globalnav-padding-x` 기준 좌측 정렬 |

`--globalnav-padding-x`는 기본값 외 반응형으로:
- ≤ 1024px → 40px
- ≤ 640px → 24px

## 컨텍스트

`.is-sub` 클래스 자체는 `globalnav.js`에서 여전히 부여됨 (홈/어바웃과 구분되는 hook으로 유지). 다만 더 이상 컨테이너 너비를 좁히지 않고, 모든 페이지에서 globalnav가 동일한 정렬 규칙을 따름.

풀스크린 오버레이 콘셉트(v0.5.17)와의 일관성: 오버레이가 화면 전체를 덮는 디자인이므로 메뉴 항목도 페이지 가장자리 padding에만 정렬되는 게 자연스러움.

## 검증

- `grep -rn "is-sub" src/` → `globalnav.js`에서 className 부여 1건만 잔존 (의도)
- 홈 / about / 케이스 스터디(eum) / 풀스크린 오버레이에서 좌측 정렬 위치가 모든 페이지에 동일하게 맞춰짐
- 1024px / 640px 브레이크포인트에서 padding 변화 정상 동작
