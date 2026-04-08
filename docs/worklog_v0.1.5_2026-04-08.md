# Worklog v0.1.5

- **버전**: 0.1.5
- **날짜**: 2026-04-08
- **이전 버전**: v0.1.4
- **프로젝트**: portfolio (Next.js 16 + React 19 + Sass)

---

## 변경 사항

### Eum 페이지 className 정리

`src/app/project/eum/page.js`의 className 검토 후 오타 및 일관성 수정.

#### 오타 수정

- **`keyscreen-header-callout`** → **`keyscreen-callout-header`** (2곳)
    - Key Screen #02, #03의 h3 className. #01은 이미 `keyscreen-callout-header`로 일관성 맞춤
- **`tabnav-penel-content`** → **`tabnav-panel-content`** (1곳)
    - 사용자 인터뷰 패널 wrapper의 자식 div 오타 수정 (penel → panel)

#### 일관성 통일

- **`typo-highlight`** → **`typography-highlight`**
    - 다른 typography 관련 클래스(`typography-copy`, `tabnav-panel-typography-copy`)와 접두사 통일

---

## 검토했으나 보류한 항목

- **`header-violator`** — design term이 의미 어긋나지만 디자인 의도 확인 후 결정 예정
- **`header-eyebrow`(h1)** — 시각/의미 충돌 가능성, 디자인 의도 확인 후 결정 예정
- **`section-headline`** — `large`/`small` 옆 모호한 기본형, 추후 정리

## 다음 작업 후보

- 빈 `Image src` 처리 방침 결정
- 데드 링크 (`href="#"`, `href=""`) 정리
- 공통 Header / Nav 컴포넌트
