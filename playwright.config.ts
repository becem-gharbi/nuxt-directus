import { defineConfig, devices } from '@playwright/test'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',

  /* Run your local dev server before starting the tests */
  webServer: [
    {
      command: 'npm run directus:start',
      url: 'http://localhost:8055',
      reuseExistingServer: !process.env.CI,
      timeout: 30000,
    },
    {
      command: getNuxtCommand(),
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
  ],

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})

function getNuxtCommand() {
  const isProd = process.env.NODE_ENV === 'production'
  const isIonic = process.env.IS_IONIC === 'true'
  if (isProd && isIonic)
    return 'nuxi preview playground_ionic'
  if (isProd && !isIonic)
    return 'nuxi preview playground'
  if (!isProd && isIonic)
    return 'nuxi dev playground_ionic'
  else
    return 'nuxi dev playground'
}
