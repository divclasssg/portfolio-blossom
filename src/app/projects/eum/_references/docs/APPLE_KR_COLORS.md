# Apple.com/kr 색상 추출

> 추출일: 2026-03-12
> 소스: https://www.apple.com/kr/ CSS 파일 6개

---

## 핵심 색상 팔레트

### 배경

| 색상 | 값 | 출처 |
|---|---|---|
| 흰색 | `#FFFFFF` | 전체 |
| 연회색 | `#F5F5F7` | main, common, `--background-color` |
| Nav light | `#FAFAFC` | header `--r-globalnav-background-opened` |
| Nav dark | `#161617` | header `--r-globalnav-background-opened-dark` |

### 텍스트

| 색상 | 값 | 출처 |
|---|---|---|
| primary | `#1D1D1F` | main, common, `--text-color` |
| secondary | `#6E6E73` | main, header |
| tertiary | `#86868B` | main, header |
| nav secondary | `#333336` | header |
| dark mode | `#E8E8ED` | header (dark variants) |
| 블랙 | `#000000` | 전체 |

### 링크 / CTA

| 색상 | 값 | 출처 |
|---|---|---|
| primary | `#0071E3` | 전체 (CTA 버튼, 포커스) |
| hover | `#0077ED` | header `--sk-button-background-hover` |
| active | `#006EDB` | header `--sk-button-background-active` |
| legacy | `#06C` (`#0066CC`) | main, common, footer |
| dark mode | `#2997FF` | main, footer |

### 상태

| 색상 | 값 | 출처 |
|---|---|---|
| 초록 | `#3E935C` | main |

### 프로모 (캠페인용)

| 색상 | 값 | 출처 |
|---|---|---|
| 핑크 | `#DE5F7D`, `#F2416B` | main |
| 오렌지 | `#E3704B`, `#F55600` | main |
| 퍼플 | `#827EB2`, `#BA62FC` | main |
| 옐로 | `#EDD142` | main |
| 블루 | `#547EAE`, `#007D96` | main |

### 서피스 / 중립

| 색상 | 값 | 출처 |
|---|---|---|
| 다크 | `#18181A`, `#272729` | main |
| 중간 | `#424245`, `#747478` | main |
| 밝은 | `#C8C8CE`, `#D2D2D7`, `#ECECF0` | main |

---

## CSS Custom Properties

```css
--background-color: #F5F5F7;
--text-color: #1D1D1F;
--gutter-color: #FFF;
--r-globalnav-background-opened: #FAFAFC;
--r-globalnav-background-opened-dark: #161617;
--sk-button-background-hover: #0077ED;
--sk-button-background-active: #006EDB;
--sk-focus-color: #0071E3;
```

---

## 추출 소스 CSS 파일

1. `/api-www/global-elements/global-header/v1/assets/globalheader.css`
2. `/ac/globalfooter/8/ko_KR/styles/ac-globalfooter.built.css`
3. `/ac/localnav/9/styles/ac-localnav.built.css`
4. `/v/home/cm/built/styles/main.built.css`
5. `/kr/home/styles/common.css`
6. `/kr/home/styles/20260312-apple-50.css` (색상 없음 — 타이포/이미지만)
