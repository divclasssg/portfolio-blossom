# 미디어 TODO

## `.mov` → `.mp4` 재인코딩 (3개)
브라우저 호환성을 위해 H.264 MP4로 재인코딩 후 R2에 교체 업로드. 이후 `.mov` → `.mp4`로 확장자 변경 필요.

- [ ] `eum/videos/key_change/key_change_02_gkuxhi.mov`
    - 참조: `src/app/projects/eum/_data/keyChanges.js` (Key Change 02 `toBe.src`)
- [ ] `eum/videos/key_screen/key_screen_01_c0phbs.mov`
    - 참조: `src/app/projects/eum/_data/finalKeyScreens.js` (#01 `video`)
- [ ] `eum/videos/key_screen/key_screen_02_wme50b.mov`
    - 참조: `src/app/projects/eum/_data/finalKeyScreens.js` (#02 `video`)

재인코딩 예시:
```bash
ffmpeg -i input.mov -vcodec h264 -acodec aac output.mp4
```

## 미사용 R2 파일 정리 (선택)
다음 파일들은 현재 코드에서 참조되지 않음. 필요 없으면 R2에서 삭제 가능.

- `eum/screenshots/develop/wireframe_01-03_g9o7gy.png`
- `eum/videos/final_prototype/final_prototype_02_scu1bk.mp4`
- `eum/videos/final_prototype/final_prototype_no_frame_lxukux.mov`
- `eum/videos/key_screen/key_screen_01_snkwjp.mp4` (c0phbs와 중복 여부 확인)
- `portfolio/m_main_video_qnayhv.mov` (메인 페이지 전용?)
- `portfolio/main_video_mryaso.mov` (메인 페이지 전용?)
