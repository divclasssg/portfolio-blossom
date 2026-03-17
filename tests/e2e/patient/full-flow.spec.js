import { test, expect } from '@playwright/test';
import { ploc } from '../fixtures/patientSelectors.js';

const WELCOME_URL = '/projects/eum/patient/onboarding/welcome';
const PATIENT_URL = '/projects/eum/patient';

// SSE mock
function mockChatSSE() {
    return [
        'data: {"type":"token","content":"증상을 좀 더 자세히 설명해 주시겠어요?"}\n\n',
        'data: {"type":"done","completed":false}\n\n',
    ].join('');
}

test.describe('환자 앱 전체 플로우', () => {
    test('로그인 → 홈 → 증상기록 → 체크인', async ({ page }) => {
        // API mock
        await page.route('**/api/eum/chat', (route) =>
            route.fulfill({
                status: 200,
                contentType: 'text/event-stream',
                headers: { 'Cache-Control': 'no-cache' },
                body: mockChatSSE(),
            })
        );
        await page.route('**/api/eum/symptoms', (route) => {
            if (route.request().method() === 'POST') {
                return route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ success: true }),
                });
            }
            return route.continue();
        });

        // ── 1. 로그인 ──
        await page.goto(WELCOME_URL);
        await expect(page.getByRole('button', { name: '로그인', exact: true })).toBeVisible({ timeout: 15_000 });
        await page.getByRole('button', { name: '로그인', exact: true }).click();
        await expect(page).toHaveURL(/\/login-pin/);

        // PIN 입력 (123456) — mock PIN은 API 호출 없이 라우팅만 하므로 쿠키 수동 설정
        const baseURL = page.context()._options?.baseURL || 'https://portfolio-blossom-d8hc.vercel.app';
        const domain = new URL(baseURL).hostname;
        await page.context().addCookies([{
            name: 'eum_patient_id',
            value: 'pat_yoon_001',
            domain,
            path: '/projects/eum',
        }]);
        for (const digit of '123456') {
            await page.getByRole('button', { name: digit, exact: true }).click();
        }
        await expect(page).toHaveURL(/\/patient\/pat_yoon_001$/, { timeout: 15_000 });

        // ── 2. 홈 확인 ──
        await expect(page.getByText('건강한 하루 보내세요')).toBeVisible({ timeout: 15_000 });
        await expect(page.getByText('최근 증상')).toBeVisible();
        await expect(page.getByText('오늘의 건강')).toBeVisible();

        // ── 3. 증상 기록 ──
        await ploc(page, 'symptomLogCta').click();
        await expect(page).toHaveURL(/\/symptoms/);
        await expect(page.getByText('어떤 증상이 있으신가요?')).toBeVisible({ timeout: 15_000 });

        // 메시지 전송
        const input = page.locator('input[aria-label="증상 입력"]');
        await input.fill('속이 쓰리고 아파요');
        await ploc(page, 'sendBtn').click();

        // AI 응답 확인
        await expect(page.getByText('설명해 주시겠어요?')).toBeVisible({ timeout: 10_000 });

        // ── 4. 홈으로 복귀 ──
        await page.locator('[aria-label="뒤로 가기"]').click();
        await expect(page).toHaveURL(/\/patient\/pat_yoon_001$/, { timeout: 10_000 });

        // ── 5. 체크인 플로우 ──
        await page.goto(PATIENT_URL + '/pat_yoon_001/checkin');
        await expect(page.getByText('서현내과의원')).toBeVisible({ timeout: 15_000 });

        // 맞아요 → 동의 → 체크인
        await page.getByText('맞아요, 체크인 할게요').click();
        await expect(page).toHaveURL(/\/checkin\/consent/);
        await expect(page.getByRole('heading', { name: '진료 체크인' })).toBeVisible();
        await page.getByText('체크인', { exact: true }).click();
        await expect(page).toHaveURL(/\/patient\/pat_yoon_001$/, { timeout: 10_000 });
    });
});
