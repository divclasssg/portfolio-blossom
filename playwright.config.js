// @ts-check
import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests/e2e',
    timeout: 120_000,
    expect: { timeout: 30_000 },
    retries: 1,
    reporter: 'html',
    use: {
        baseURL: 'https://portfolio-blossom-d8hc.vercel.app',
        viewport: { width: 1440, height: 900 },
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'chromium',
            use: { browserName: 'chromium' },
        },
    ],
});
