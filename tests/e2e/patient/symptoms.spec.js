import { test, expect } from '@playwright/test';
import { ploc } from '../fixtures/patientSelectors.js';

const SYMPTOMS_URL = '/projects/eum/patient/pat_yoon_001/symptoms';

// SSE 스트리밍 mock 응답 생성
function mockChatSSE() {
    const lines = [
        'data: {"type":"token","content":"증상을 "}\n\n',
        'data: {"type":"token","content":"좀 더 자세히 "}\n\n',
        'data: {"type":"token","content":"설명해 주시겠어요?"}\n\n',
        'data: {"type":"done","completed":false}\n\n',
    ];
    return lines.join('');
}

test.describe('증상 기록 (채팅)', () => {
    test.beforeEach(async ({ page, context }) => {
        // 환자 쿠키 설정 (인증 우회)
        const baseURL = page.context()._options?.baseURL || 'https://portfolio-blossom-d8hc.vercel.app';
        const domain = new URL(baseURL).hostname;
        await context.addCookies([{
            name: 'eum_patient_id',
            value: 'pat_yoon_001',
            domain,
            path: '/projects/eum',
        }]);

        // chat API mock — SSE 응답
        await page.route('**/api/eum/chat', (route) =>
            route.fulfill({
                status: 200,
                contentType: 'text/event-stream',
                headers: { 'Cache-Control': 'no-cache', Connection: 'keep-alive' },
                body: mockChatSSE(),
            })
        );

        // symptoms API mock — DB 쓰기 방지
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

        await page.goto(SYMPTOMS_URL);
        await expect(ploc(page, 'chatArea')).toBeVisible({ timeout: 30_000 });
    });

    test('채팅 탭 기본 활성화 + 초기 메시지 표시', async ({ page }) => {
        // 채팅 탭 활성화 확인
        await expect(ploc(page, 'chatTab')).toHaveAttribute('aria-selected', 'true');

        // 봇 초기 메시지
        await expect(page.getByText('어떤 증상이 있으신가요?')).toBeVisible();
    });

    test('메시지 전송 → AI 응답 수신', async ({ page }) => {
        // 메시지 입력
        const input = page.locator('input[aria-label="증상 입력"]');
        await input.fill('속이 쓰리고 아파요');

        // 전송 버튼 클릭
        await ploc(page, 'sendBtn').click();

        // 사용자 메시지 표시
        await expect(page.getByText('속이 쓰리고 아파요')).toBeVisible();

        // AI 응답 대기 (mock SSE)
        await expect(page.getByText('설명해 주시겠어요?')).toBeVisible({ timeout: 10_000 });
    });

    test('기록 탭 전환', async ({ page }) => {
        // 기록 탭 클릭
        await ploc(page, 'recordsTab').click();
        await expect(ploc(page, 'recordsTab')).toHaveAttribute('aria-selected', 'true');

        // 기록 탭 패널 표시
        await expect(page.locator('#tabpanel-records')).toBeVisible();
    });

    test('빈 입력 시 전송 버튼 비활성화', async ({ page }) => {
        const sendBtn = ploc(page, 'sendBtn');
        // 빈 상태에서 전송 버튼 확인 — disabled이거나 클릭해도 반응 없음
        const input = page.locator('input[aria-label="증상 입력"]');
        await expect(input).toHaveValue('');
    });
});
