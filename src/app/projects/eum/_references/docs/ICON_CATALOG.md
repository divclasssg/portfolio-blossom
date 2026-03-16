# 이음 아이콘 카탈로그

Figma Design_System > Common Components에서 추출한 아이콘 목록.

---

## 컴포넌트 공통 인터페이스

```jsx
// 모든 아이콘 공통 props
{ variant, size = 24, color = 'currentColor', className, ...rest }
// - aria-hidden="true" 기본 적용
// - 접근성이 필요한 경우: <ArrowIcon role="img" aria-label="뒤로 가기" />
```

---

## 아이콘 목록

| 컴포넌트 | variant | Figma 노드 | SVG 원본 | 용도 |
|---|---|---|---|---|
| `AiIcon` | (단일) | 34:137 | ai.svg | AI 섹션 헤더, AI 기능 표시 |
| `ArrowIcon` | `left` | 96:1106 | arrow-left.svg | 뒤로 가기, 이전 |
| `ArrowIcon` | `down` | 96:1105 | arrow-down.svg | 드롭다운, 접기/펼치기 |
| `ArrowIcon` | `right` | 96:1104 | arrow-right.svg | 앞으로, 다음, 목록 아이템 |
| `BellIcon` | `basic` | 97:895 | bell-basic.svg | 알림 버튼 (미활성) |
| `BellIcon` | `fill` | 97:894 | bell-fill.svg | 알림 버튼 (활성) |
| `BellIcon` | `alarm` | 97:893 | bell-alarm.svg | 미읽은 알림 있음 |
| `PersonIcon` | `basic` | 96:1115 | person-basic.svg | 사용자 프로필, 마이페이지 |
| `PersonIcon` | `fill` | 96:1114 | person-fill.svg | 활성 프로필 |
| `RotateIcon` | `basic` | 96:1117 | rotate-basic.svg | 새로고침, 재시도 |
| `RotateIcon` | `fill` | 96:1118 | rotate-fill.svg | 활성 새로고침 |
| `NoticeIcon` | `basic` | 96:1124 | notice-basic.svg | 공지, 알림 (미활성) |
| `NoticeIcon` | `fill` | 96:1123 | notice-fill.svg | 공지, 알림 (활성) |
| `MicIcon` | `basic` | 96:1127 | mic-basic.svg | 음성 입력 (미활성) |
| `MicIcon` | `fill` | 96:1126 | mic-fill.svg | 음성 입력 (활성/녹음 중) |
| `PillIcon` | `basic` | 96:1157 | pill-basic.svg | 약물 정보, 투약 |
| `PillIcon` | `fill` | 96:1158 | pill-fill.svg | 활성 약물 |
| `CheckmarkIcon` | `active` | 96:1108 | checkmark-active.svg | 완료, 선택됨 |
| `CheckmarkIcon` | `inactive` | 96:1109 | checkmark-inactive.svg | 미완료, 미선택 |
| `MapIcon` | `basic` | 96:1120 | map-basic.svg | 지도, 위치 (미활성) |
| `MapIcon` | `fill` | 96:1121 | map-fill.svg | 지도, 위치 (활성) |
| `PinIcon` | `inactive` | 97:920 | pin-inactive.svg | 현재 위치 (미선택) |
| `PinIcon` | `active` | 97:919 | pin-active.svg | 현재 위치 (선택됨) |
| `DocumentIcon` | `basic` | 96:1112 | document-basic.svg | 문서, 진료기록 |
| `DocumentIcon` | `fill` | 96:1111 | document-fill.svg | 활성 문서 |
| `DocumentIcon` | `addnote` | 96:1135 | document-addnote.svg | 문서 추가, 노트 추가 |
| `WarningIcon` | `info` | 101:1063 | warning-info.svg | 정보, 안내 |
| `WarningIcon` | `security` | 96:1033 | warning-security.svg | 보안 경고 (미활성) |
| `WarningIcon` | `security-fill` | 96:1032 | warning-security-fill.svg | 보안 경고 (활성) |
| `DragHandleIcon` | (단일) | 27:140 | drag-handle.svg | 드래그 핸들 (6-dot) |
| `DragIcon` | (단일) | 34:211 | drag.svg | 드래그 (4-line) |
| `XmarkIcon` | `arrow` | 99:898 | xmark-arrow.svg | 뒤로가기 + 닫기 (화살표 X) |
| `XmarkIcon` | `circle-minus` | 99:897 | xmark-circle-minus.svg | 항목 제거 |
| `XmarkIcon` | `circle` | 99:896 | xmark-circle.svg | 닫기 (원형) |

---

## SVG 특이사항

- **ai.svg만 stroke 기반**: `stroke={color}` 사용, 나머지는 `fill={color}`
- **비정방형 viewBox**: arrow(29×24), notice(27×29), document-addnote(31×25), rotate-fill(31×24) 등 — 컴포넌트 내 variant별 viewBox 적용
- 모든 SVG 원본: `src/app/projects/eum/_references/icons/`
