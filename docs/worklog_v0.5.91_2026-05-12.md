# worklog v0.5.91 — habit-together-healthcare-ux localnav 논문 다운로드 버튼 누락 수정

## 요약

`/research/habit-together-healthcare-ux` 진입 시 localnav 우측에 "논문 다운로드" CTA가 표시되지 않던 문제 수정. `src/_components/localnav.js`의 `SECTIONS` 배열에 `autonomous-vehicle-trust-ux`용 항목만 있었고, habit-together-healthcare-ux용 매처가 없어 generic `/research` fallback에 잡혀 CTA가 사라졌다.

## 원인

`SECTIONS`는 `find`로 첫 매칭만 사용한다. 기존 순서:

```
1) /projects/eum
2) /projects/cronometer
3) /projects/liverpoolfc
4) /research/autonomous-vehicle-trust-ux  ← CTA 있음
5) /research                              ← CTA 없음 (fallback)
```

habit-together-healthcare-ux는 4번을 못 만나고 5번에 잡혀 `hasCta = false`로 떨어졌다. 페이지의 `ResearchHero`에는 이미 `download` prop이 있어 hero 영역에는 버튼이 있었지만, 스크롤 후 노출되는 localnav에는 없었다.

## 변경

`src/_components/localnav.js`의 `SECTIONS`에 habit-together-healthcare-ux용 매처를 generic `/research` 앞에 추가:

```js
{
    label: "Research",
    match: (p) => p?.startsWith("/research/habit-together-healthcare-ux"),
    ctaHref:
        "/download/Developing the Intelligent Healthcare Service Considering the Stage of User Experience.pdf",
    ctaLabel: "논문 다운로드",
    ctaTarget: "_blank",
},
```

`ctaHref`는 `app/research/habit-together-healthcare-ux/page.js`의 `ResearchHero` `download.href`와 동일한 PDF 경로. `public/download/` 아래 실제 파일 존재 확인 완료.

## 후속

v0.5.90 플랜(research JSON 데이터 모델 + `[slug]` 동적 라우트)이 실행되면 슬러그별 CTA도 데이터(JSON) 쪽으로 옮기는 게 자연스럽다. 그때 `SECTIONS`의 research 분기를 슬러그별로 하드코딩하지 않고, `_data/{slug}.json`의 `download` 필드를 읽어 자동 구성하도록 정리할 수 있다. 지금은 페이지 2개라 하드코딩이 충분하다.
