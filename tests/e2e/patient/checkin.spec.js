import { test, expect } from '@playwright/test';
import { ploc } from '../fixtures/patientSelectors.js';

const CHECKIN_URL = '/projects/eum/patient/checkin';

test.describe('환자 체크인 플로우', () => {
    test('병원 확인 → 동의 → 체크인', async ({ page }) => {
        await page.goto(CHECKIN_URL);

        // 병원 이름 확인
        await expect(page.getByText('서현내과의원')).toBeVisible({ timeout: 15_000 });
        await expect(page.getByText('이 병원에 오셨나요?')).toBeVisible();

        // "맞아요" 클릭
        await page.getByText('맞아요, 체크인 할게요').click();
        await expect(page).toHaveURL(/\/checkin\/consent/);

        // 동의 페이지
        await expect(page.getByRole('heading', { name: '진료 체크인' })).toBeVisible();
        await expect(page.getByText('체크인 시 다음 데이터를 전송합니다')).toBeVisible();

        // 체크인 버튼
        await page.getByText('체크인', { exact: true }).click();
        await expect(page).toHaveURL(/\/patient$/);
    });

    test('다른 병원 → 코드 입력 → 체크인', async ({ page }) => {
        await page.goto(CHECKIN_URL);
        await expect(page.getByText('서현내과의원')).toBeVisible({ timeout: 15_000 });

        // "아니오" 클릭 → 병원 찾기
        await page.getByText('아니오, 다른 병원이에요').click();
        await expect(page).toHaveURL(/\/checkin\/find/);

        // 병원 코드 입력
        await expect(page.getByText('병원 코드로 체크인하기')).toBeVisible();
        await ploc(page, 'hospitalCode').fill('482951');

        // 체크인 버튼 클릭
        await page.getByText('체크인할께요').click();
        await expect(page).toHaveURL(/\/checkin\/consent/);
    });

    test('잘못된 코드 → 에러 메시지', async ({ page }) => {
        await page.goto('/projects/eum/patient/checkin/find');
        await expect(page.getByText('병원 코드로 체크인하기')).toBeVisible({ timeout: 15_000 });

        await ploc(page, 'hospitalCode').fill('000000');
        await page.getByText('체크인할께요').click();

        // 에러 메시지
        await expect(ploc(page, 'codeError')).toBeVisible();
        await expect(ploc(page, 'codeError')).toContainText('올바른 코드를 입력해주세요');
    });
});
