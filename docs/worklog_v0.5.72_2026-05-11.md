# worklog v0.5.72 — 2026-05-11

## 요약

Cloudinary → R2 마이그레이션 잔존물인 Key Changes 레거시 AS-IS png 3장을 R2 버킷에서 삭제. v0.5.68 에서 "캐시 환경 호환성을 위해 즉시 삭제하지 않음" 으로 보류해뒀던 결정을 종결.

## 배경

- **v0.5.68 (2026-04-24)**: Key Changes AS-IS 를 hash 붙은 png (`*_qeuusd / *_fuhr7p / *_vbttth`) → hash 없는 1290w webp 로 교체. 레거시 png 는 캐시 안전망으로 잔존.
- **v0.5.70 (2026-05-10)**: webp 를 768w 로 재인코딩, AS-IS 비주얼 iteration 마감.
- v0.5.70 배포 후 캐시 stale 이슈 보고 0건. 코드/SCSS/JSON 에서 레거시 hash 참조도 0건 (`grep -E "qeuusd|fuhr7p|vbttth"` 결과 worklog 히스토리 텍스트 외 없음).

## 삭제 대상 (R2 — `portfolio-asset`)

| 객체 | 크기 | 업로드 일자 |
|---|---|---|
| `portfolio/eum/screenshots/deliver/key_change_01_asis_qeuusd.png` | 39 KB | 2026-04-15 |
| `portfolio/eum/screenshots/deliver/key_change_02_asis_fuhr7p.png` | 177 KB | 2026-04-15 |
| `portfolio/eum/screenshots/deliver/key_change_03_asis_vbttth.png` | 221 KB | 2026-04-15 |

총 ~437 KB · 3 객체.

## 실행

```bash
aws s3 rm s3://portfolio-asset/portfolio/eum/screenshots/deliver/key_change_01_asis_qeuusd.png --profile r2
aws s3 rm s3://portfolio-asset/portfolio/eum/screenshots/deliver/key_change_02_asis_fuhr7p.png --profile r2
aws s3 rm s3://portfolio-asset/portfolio/eum/screenshots/deliver/key_change_03_asis_vbttth.png --profile r2
```

대량 사고 방지를 위해 와일드카드·`--recursive` 미사용, 단건 3회.

## 검증

`aws s3 ls s3://portfolio-asset/portfolio/eum/screenshots/deliver/ --profile r2` 결과:

```
2026-05-10 16:57:03   53356 key_change_01_asis.webp
2026-05-10 16:57:03  142046 key_change_02_asis.webp
2026-05-10 16:57:04  109118 key_change_03_asis.webp
```

레거시 png 3개 모두 사라지고, 현재 활성 webp 3개는 그대로 남아 있음. 같은 폴더의 다른 hash-named 파일(`5c57984...jpg`, `89cc14e...png` 등 5건)은 Key Changes 와 무관한 다른 deliver 섹션 이미지라 그대로 둠.

## 영향 범위

- **R2 객체 삭제만** — 코드/SCSS/데이터 변경 없음.
- `src/app/projects/eum/_data/keyChanges.js` 는 v0.5.68 부터 hash 없는 webp 만 참조하므로 사이트 동작 무영향.
- Cloudflare R2 의 stale 캐시는 자연 만료. 어차피 클라이언트 코드가 더 이상 해당 URL 을 요청하지 않으므로 사용자에게는 무관.

## 후속 검토

- 다른 섹션(`develop/`, `define/`, `discover/`) 에도 Cloudinary hash 가 붙은 채 잔존하는 자산이 다수 존재 (`*_kxz16i.jpg`, `*_iv9h6w.png` 등). 모두 현재 코드에서 참조 중이므로 즉시 정리 대상 아님. 추후 파일명 normalization 작업 시 일괄 처리 후보.
