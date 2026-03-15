import { test, expect } from '@playwright/test';
import { SELECTORS, loc } from '../fixtures/selectors.js';

const DOCTOR_URL = '/projects/eum/doctor';

test.describe('D-F12 환자 데이터 모달', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(DOCTOR_URL);
        await expect(loc(page, 'panel')).toBeVisible({ timeout: 30_000 });
    });

    test('헤더 아이콘으로 모달 열기', async ({ page }) => {
        await loc(page, 'chartModalBtn').click();
        await expect(loc(page, 'modal')).toBeVisible();

        // 증상 탭 활성 확인
        const symptomsTab = page.getByRole('tab', { name: '증상' });
        await expect(symptomsTab).toHaveAttribute('aria-selected', 'true');
    });

    test('타임라인 "데이터보기"로 모달 열기', async ({ page }) => {
        const dataBtn = loc(page, 'timelineDataBtn');
        if (await dataBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
            await dataBtn.click();
            await expect(loc(page, 'modal')).toBeVisible();
        }
    });

    test('탭 전환 (증상 ↔ 진료이력)', async ({ page }) => {
        await loc(page, 'chartModalBtn').click();
        await expect(loc(page, 'modal')).toBeVisible();

        // 진료이력 탭 클릭
        const visitTab = page.getByRole('tab', { name: '진료이력' });
        await visitTab.click();
        await expect(visitTab).toHaveAttribute('aria-selected', 'true');

        // 증상 탭 비활성 확인
        const symptomsTab = page.getByRole('tab', { name: '증상' });
        await expect(symptomsTab).toHaveAttribute('aria-selected', 'false');

        // 다시 증상 탭
        await symptomsTab.click();
        await expect(symptomsTab).toHaveAttribute('aria-selected', 'true');
    });

    test('Escape 키로 모달 닫기', async ({ page }) => {
        await loc(page, 'chartModalBtn').click();
        await expect(loc(page, 'modal')).toBeVisible();

        await page.keyboard.press('Escape');
        await expect(loc(page, 'modal')).not.toBeVisible();
    });

    test('닫기 버튼으로 모달 닫기', async ({ page }) => {
        await loc(page, 'chartModalBtn').click();
        await expect(loc(page, 'modal')).toBeVisible();

        await loc(page, 'modalClose').click();
        await expect(loc(page, 'modal')).not.toBeVisible();
    });

    test('포커스 트랩 — Tab 순환이 모달 내부에 유지', async ({ page }) => {
        await loc(page, 'chartModalBtn').click();
        await expect(loc(page, 'modal')).toBeVisible();

        // 모달 내부 포커스 가능 요소 수 확인
        const focusableCount = await loc(page, 'modal').evaluate((modal) => {
            return modal.querySelectorAll(
                'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
            ).length;
        });

        // 포커스 가능 요소가 있으면 Tab을 여러 번 눌러도 모달 안에 유지
        if (focusableCount > 0) {
            for (let i = 0; i < focusableCount + 2; i++) {
                await page.keyboard.press('Tab');
            }

            // 현재 포커스가 모달 내부인지 확인
            const isInside = await loc(page, 'modal').evaluate((modal) => {
                return modal.contains(document.activeElement);
            });
            expect(isInside).toBe(true);
        }
    });

    test('필터 기간 변경', async ({ page }) => {
        await loc(page, 'chartModalBtn').click();
        await expect(loc(page, 'modal')).toBeVisible();

        const periodFilter = loc(page, 'periodFilter');
        if (await periodFilter.isVisible({ timeout: 3_000 }).catch(() => false)) {
            // 필터 내 버튼 클릭 (기간 옵션)
            const filterBtns = periodFilter.locator('button');
            const count = await filterBtns.count();
            if (count > 1) {
                // 두 번째 필터 클릭
                await filterBtns.nth(1).click();
                // 클릭한 버튼이 활성 상태인지 확인 (aria-pressed 또는 클래스)
                const btn = filterBtns.nth(1);
                const isActive = await btn.evaluate((el) =>
                    el.classList.contains('active') ||
                    el.getAttribute('aria-pressed') === 'true' ||
                    el.classList.toString().includes('active')
                );
                expect(isActive).toBe(true);
            }
        }
    });
});
