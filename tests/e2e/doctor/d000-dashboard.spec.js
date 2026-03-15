import { test, expect } from '@playwright/test';
import { SELECTORS, loc } from '../fixtures/selectors.js';

const DOCTOR_URL = '/projects/eum/doctor';

test.describe('D-000 의사 대시보드', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(DOCTOR_URL);
        // 패널이 렌더링될 때까지 대기
        await expect(page.locator(SELECTORS.panel)).toBeVisible({ timeout: 30_000 });
    });

    test('대시보드 주요 섹션 렌더링', async ({ page }) => {
        // 패널 존재
        await expect(loc(page, 'panel')).toBeVisible();

        // 환자 프로필 영역 (이름 표시)
        await expect(page.getByText('윤서진')).toBeVisible();

        // Chief Complaint 섹션
        await expect(page.getByText('Chief Complaint')).toBeVisible();

        // 타임라인 섹션
        await expect(page.getByText('Timeline')).toBeVisible();

        // AI 섹션 or 로딩 상태
        const aiTitle = page.getByText('AI Analysis');
        const loading = page.locator(SELECTORS.progressbar);
        await expect(aiTitle.or(loading)).toBeVisible({ timeout: 10_000 });

        // AI 로딩 중이면 완료까지 대기
        if (await loading.isVisible()) {
            await expect(aiTitle).toBeVisible({ timeout: 120_000 });
        }

        // 푸터 CTA
        await expect(loc(page, 'resultWriteBtn')).toBeVisible();
    });

    test('타임라인 펼치기/접기', async ({ page }) => {
        const moreBtn = loc(page, 'timelineMoreBtn');

        // 더보기 버튼이 있으면 테스트 (데이터 3건 이하이면 버튼 미표시)
        if (await moreBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
            await moreBtn.click();
            // 접기 버튼이 나타나야 함
            await expect(loc(page, 'timelineCollapseBtn')).toBeVisible();

            // 접기 클릭
            await loc(page, 'timelineCollapseBtn').click();
            // 더보기 버튼이 다시 표시
            await expect(moreBtn).toBeVisible();
        }
    });

    test('패널 닫기 → 다시 열기', async ({ page }) => {
        // 닫기
        await loc(page, 'panelClose').click();
        await expect(loc(page, 'panel')).not.toBeVisible();

        // 플로팅 버튼 표시
        await expect(loc(page, 'panelOpen')).toBeVisible();

        // 다시 열기
        await loc(page, 'panelOpen').click();
        await expect(loc(page, 'panel')).toBeVisible();
    });

    test('핀 토글', async ({ page }) => {
        const pinBtn = page.locator('[aria-label="패널 위치 고정"]');
        const unpinBtn = page.locator('[aria-label="패널 고정 해제"]');

        // 초기: 고정 안 됨
        await expect(pinBtn).toBeVisible();

        // 핀 클릭 → 고정
        await pinBtn.click();
        await expect(unpinBtn).toBeVisible();

        // 다시 클릭 → 해제
        await unpinBtn.click();
        await expect(pinBtn).toBeVisible();
    });

    test('투명도 슬라이더', async ({ page }) => {
        const slider = page.locator('input[type="range"]');
        // 슬라이더가 있는 경우만 (PanelHeader에 포함)
        if (await slider.isVisible({ timeout: 3_000 }).catch(() => false)) {
            // 초기값 100
            await expect(slider).toHaveValue('100');

            // 값 변경
            await slider.fill('50');

            // 패널 opacity 변경 확인
            const panel = loc(page, 'panel');
            const opacity = await panel.evaluate((el) => el.style.opacity);
            expect(parseFloat(opacity)).toBeCloseTo(0.5, 1);
        }
    });
});
