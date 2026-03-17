import { test, expect } from '@playwright/test';
import { ploc } from '../fixtures/patientSelectors.js';

// redirect를 통해 /patient/[patientId]로 이동 (쿠키 없으면 onboarding)
const PATIENT_URL = '/projects/eum/patient';

test.describe('환자 홈 대시보드', () => {
    test.beforeEach(async ({ page, context }) => {
        // 환자 쿠키 설정 (redirect 페이지에서 patientId 결정용)
        const baseURL = page.context()._options?.baseURL || 'https://portfolio-blossom-d8hc.vercel.app';
        const domain = new URL(baseURL).hostname;
        await context.addCookies([{
            name: 'eum_patient_id',
            value: 'pat_yoon_001',
            domain,
            path: '/projects/eum',
        }]);
        await page.goto(PATIENT_URL);
        // 페이지 로드 대기 — 환자 홈 고유 텍스트로 확인
        await expect(page.getByText('건강한 하루 보내세요')).toBeVisible({ timeout: 30_000 });
    });

    test('홈 대시보드 주요 섹션 렌더링', async ({ page }) => {
        // 인사말 섹션
        await expect(page.getByText('건강한 하루 보내세요')).toBeVisible();

        // 최근 증상 섹션
        await expect(page.getByText('최근 증상')).toBeVisible();
        await expect(page.getByText('최근 7일')).toBeVisible();

        // 증상 기록 CTA
        await expect(ploc(page, 'symptomLogCta')).toBeVisible();

        // 오늘의 건강 섹션
        await expect(page.getByText('오늘의 건강')).toBeVisible();
        await expect(page.getByRole('button', { name: /심박수/ })).toBeVisible();
        await expect(page.getByRole('button', { name: /수면/ })).toBeVisible();
        await expect(page.getByRole('button', { name: /혈압/ })).toBeVisible();
        await expect(page.getByRole('button', { name: /걸음 수/ })).toBeVisible();

        // 지난 진료 결과
        await expect(page.getByText('지난 진료 결과')).toBeVisible();

        // TabBar 4개 탭
        await expect(ploc(page, 'tabBar')).toBeVisible();
    });

    test('증상 기록 CTA → 증상 페이지 이동', async ({ page }) => {
        await ploc(page, 'symptomLogCta').click();
        await expect(page).toHaveURL(/\/symptoms/);
    });

    test('바이탈 아코디언 열기/닫기', async ({ page }) => {
        const heartRateBtn = page.getByRole('button', { name: /심박수/ });
        await heartRateBtn.click();
        // 상세 패널 펼침 확인
        await expect(heartRateBtn).toHaveAttribute('aria-expanded', 'true');

        // 다시 클릭 → 접힘
        await heartRateBtn.click();
        await expect(heartRateBtn).toHaveAttribute('aria-expanded', 'false');
    });

    test('TabBar 네비게이션', async ({ page }) => {
        // 증상 기록 탭 (TabBar — exact match)
        await page.getByRole('link', { name: '증상 기록', exact: true }).click();
        await expect(page).toHaveURL(/\/symptoms/);
    });
});
