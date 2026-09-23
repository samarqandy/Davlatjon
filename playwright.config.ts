import { defineConfig, devices } from "@playwright/test";

/**
 * Сквозные тесты в браузере.
 * - E2E_BASE_URL — проверить уже запущенный сайт (например, `npm run dev`).
 * - PLAYWRIGHT_CHROMIUM_PATH — свой путь к Chromium, если браузеры Playwright не установлены.
 */
const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:3100";
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH;

export default defineConfig({
  testDir: "e2e",
  timeout: 30_000,
  fullyParallel: true,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "retain-on-failure",
    ...(executablePath ? { launchOptions: { executablePath } } : {}),
  },
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: "npm run build && npm run start -- -p 3100",
        url: baseURL,
        reuseExistingServer: true,
        timeout: 300_000,
      },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "phone", use: { ...devices["Pixel 7"] } },
  ],
});
