# worklog v0.5.29 — 2026-04-29

## 요약

`/research/autonomous-vehicle-trust-ux` 페이지에서만 localnav 우측에 "논문 다운로드" CTA가 노출되도록 SECTIONS 엔트리를 한 줄 추가. 페이지 hero의 다운로드 버튼과 동일한 PDF로 연결됨.

## 컨텍스트

- v0.5.28에서 localnav를 SECTIONS 기반 공용 컴포넌트로 일반화하면서, 각 섹션이 자체 CTA(`ctaHref` / `ctaLabel` / `ctaTarget`)를 정의할 수 있는 구조가 마련됨.
- "Research" 섹션은 generic 매칭(`/research`)만 갖고 CTA 자리가 비어 있는 상태. 페이지 안 hero 섹션에는 "논문 다운로드" 버튼이 있으나 본문 아래로 스크롤한 뒤에는 위로 다시 올라가야 PDF에 닿을 수 있었음.
- 다른 research 페이지가 추후 추가될 가능성도 있어, 단일 SECTIONS 엔트리에 CTA를 박아넣기보다 **페이지 단위로 specific 엔트리를 추가하는 패턴**이 자연스러움.

## 변경 사항

### 1. localnav SECTIONS에 autonomous-vehicle-trust-ux 전용 엔트리 추가

`src/_components/localnav.js`에서 generic `/research` 매칭 **앞**에 더 구체적인 매칭을 가진 엔트리를 1개 삽입. `Array.prototype.find()`는 첫 매칭을 반환하므로 순서가 중요.

```js
{
    label: "Research",
    match: (p) => p?.startsWith("/research/autonomous-vehicle-trust-ux"),
    ctaHref:
        "/download/Importance of In-Vehicle Information and Driving Context Characteristics for Building Trust in Fully Autonomous Vehicles.pdf",
    ctaLabel: "논문 다운로드",
    ctaTarget: "_blank",
},
{
    label: "Research",
    match: (p) => p?.startsWith("/research"),
},
```

- 라벨은 그대로 `"Research"` 유지 — 사용자가 인식하는 섹션 정체성은 동일.
- `ctaLabel`은 페이지 hero 버튼과 동일한 문구 `"논문 다운로드"`.
- `ctaTarget: "_blank"`로 PDF가 새 탭에서 열림 — hero 버튼과 동일한 동작.
- SCSS는 손대지 않음. 기존 `.localnav-demo` 스타일이 그대로 적용됨.

## 검증

- `/research/autonomous-vehicle-trust-ux` 진입 후 스크롤 → localnav 우측에 "논문 다운로드" 버튼 노출, 클릭 시 새 탭에서 PDF 열림.
- `/research`(또는 다른 하위 경로)에서는 generic 엔트리가 잡혀 CTA 자리 비어 있음.
- `/projects/eum`, `/projects/cronometer`, `/projects/liverpoolfc`는 각자 데모 CTA 정상 노출 — 회귀 없음.
