import { test, expect } from '@playwright/test';
import { SELECTORS, loc } from '../fixtures/selectors.js';

const DOCTOR_URL = '/projects/eum/doctor';

test.describe('Doctor 패널 전체 플로우', () => {
    test('D-000 → D-F12 모달 → D-001 → 전송 성공', async ({ page }) => {
        // transmit API mock (Supabase 쓰기 방지)
        await page.route('**/api/eum/transmit', (route) =>
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ success: true }),
            })
        );

        // ── D-000 대시보드 ──
        await page.goto(DOCTOR_URL);
        await expect(loc(page, 'panel')).toBeVisible({ timeout: 30_000 });

        // 환자 이름 확인
        await expect(page.getByText('윤서진')).toBeVisible();

        // ── D-F12 모달 열기/닫기 ──
        await loc(page, 'chartModalBtn').click();
        await expect(loc(page, 'modal')).toBeVisible();

        // 탭 전환
        const visitTab = page.getByRole('tab', { name: '진료이력' });
        await visitTab.click();
        await expect(visitTab).toHaveAttribute('aria-selected', 'true');

        // 모달 닫기
        await page.keyboard.press('Escape');
        await expect(loc(page, 'modal')).not.toBeVisible();

        // ── "결과 작성" 클릭 → D-001 ──
        await loc(page, 'resultWriteBtn').click();
        await expect(page).toHaveURL(/\/doctor\/result/);
        await expect(loc(page, 'panel')).toBeVisible({ timeout: 30_000 });

        // D-001 주요 섹션 존재 확인
        await expect(page.getByText('Clinical Notes')).toBeVisible();
        await expect(page.getByText('Treatment Plan')).toBeVisible();

        // ── 전송 다이얼로그 → 전송 성공 ──
        await loc(page, 'transmitBtn').click();
        await expect(loc(page, 'transmitDialog')).toBeVisible();

        const confirmBtn = loc(page, 'transmitDialog').getByText('전송', { exact: true });
        await confirmBtn.click();

        // 성공 메시지
        await expect(page.getByText('전송이 완료되었습니다')).toBeVisible({ timeout: 10_000 });
    });
});
