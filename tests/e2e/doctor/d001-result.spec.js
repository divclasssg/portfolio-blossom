import { test, expect } from '@playwright/test';
import { SELECTORS, loc } from '../fixtures/selectors.js';

const RESULT_URL = '/projects/eum/doctor/result';
const DOCTOR_URL = '/projects/eum/doctor';

test.describe('D-001 결과 확인 및 전송', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(RESULT_URL);
        await expect(loc(page, 'panel')).toBeVisible({ timeout: 30_000 });
    });

    test('결과 페이지 전체 섹션 렌더링', async ({ page }) => {
        // 주요 섹션 제목 확인
        const sections = [
            'Clinical Notes',
            'AI Patient Summary',
            'Treatment Plan',
            'Action Items',
            'Prescription',
            'Referral',
            'Next Visit',
        ];

        for (const title of sections) {
            await expect(page.getByText(title, { exact: false })).toBeVisible();
        }

        // CTA 버튼 존재
        await expect(loc(page, 'transmitBtn')).toBeVisible();
        await expect(loc(page, 'cancelBtn')).toBeVisible();
    });

    test('뒤로가기 버튼 → D-000', async ({ page }) => {
        const backBtn = loc(page, 'headerBack');
        await expect(backBtn).toBeVisible();
        await backBtn.click();
        await expect(page).toHaveURL(new RegExp(DOCTOR_URL + '/?$'));
    });

    test('취소 버튼 → D-000', async ({ page }) => {
        await loc(page, 'cancelBtn').click();
        await expect(page).toHaveURL(new RegExp(DOCTOR_URL + '/?$'));
    });

    test('전송 다이얼로그 열기 → 취소로 닫기', async ({ page }) => {
        await loc(page, 'transmitBtn').click();
        await expect(loc(page, 'transmitDialog')).toBeVisible();

        // 취소 버튼 클릭
        const cancelInDialog = loc(page, 'transmitDialog').getByText('취소');
        await cancelInDialog.click();
        await expect(loc(page, 'transmitDialog')).not.toBeVisible();
    });

    test('다이얼로그 오버레이 클릭 닫기', async ({ page }) => {
        await loc(page, 'transmitBtn').click();
        await expect(loc(page, 'transmitDialog')).toBeVisible();

        // 오버레이 (dialog의 부모) 클릭 — dialog 카드 바깥
        // TransmissionDialog: overlay > card(role=dialog)
        // overlay에 onClick={onClose}, card에 stopPropagation
        const dialog = loc(page, 'transmitDialog');
        const overlay = dialog.locator('..');
        // 좌상단 구석 클릭 (카드 바깥)
        await overlay.click({ position: { x: 5, y: 5 } });
        await expect(dialog).not.toBeVisible();
    });

    test('다이얼로그 Escape 닫기', async ({ page }) => {
        await loc(page, 'transmitBtn').click();
        await expect(loc(page, 'transmitDialog')).toBeVisible();

        await page.keyboard.press('Escape');
        await expect(loc(page, 'transmitDialog')).not.toBeVisible();
    });

    test('전송 성공 (API mock)', async ({ page }) => {
        // transmit API mock — 성공 응답
        await page.route('**/api/eum/transmit', (route) =>
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ success: true }),
            })
        );

        await loc(page, 'transmitBtn').click();
        await expect(loc(page, 'transmitDialog')).toBeVisible();

        // 전송 버튼 클릭
        const confirmBtn = loc(page, 'transmitDialog').getByText('전송', { exact: true });
        await confirmBtn.click();

        // 성공 메시지 표시
        await expect(page.getByText('전송이 완료되었습니다')).toBeVisible({ timeout: 10_000 });
    });

    test('전송 실패 (API mock) → 에러/재시도', async ({ page }) => {
        // transmit API mock — 500 에러
        await page.route('**/api/eum/transmit', (route) =>
            route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({ error: '서버 오류' }),
            })
        );

        await loc(page, 'transmitBtn').click();
        await expect(loc(page, 'transmitDialog')).toBeVisible();

        const confirmBtn = loc(page, 'transmitDialog').getByText('전송', { exact: true });
        await confirmBtn.click();

        // 에러 메시지 + 재시도 버튼
        await expect(page.getByText('전송에 실패했습니다')).toBeVisible({ timeout: 10_000 });
        await expect(page.getByText('재시도')).toBeVisible();
    });
});
