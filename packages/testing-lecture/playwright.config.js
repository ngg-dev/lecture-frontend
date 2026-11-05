import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './e2e', fullyParallel: true, retries: 0,
  use: { baseURL: process.env.LECTURE_BASE_URL || 'http://127.0.0.1:4193/lecture-frontend/lectures/testing-lecture/', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  reporter: [['list']],
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
