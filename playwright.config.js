import { defineConfig } from '@playwright/test'

const apiDirectory = '../Trello-Api'
const databaseName =
  process.env.MONGODB_TEST_DATABASE || 'trello_phase0_test_playwright'
const externalServers = process.env.PLAYWRIGHT_EXTERNAL_SERVERS === '1'

if (!process.env.MONGODB_TEST_URI) {
  throw new Error('MONGODB_TEST_URI must point to a disposable replica set.')
}

export default defineConfig({
  testDir: './e2e',
  globalTimeout: 60_000,
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:5173',
    browserName: 'chromium',
    channel: 'chrome',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  webServer: externalServers ? undefined : [
    {
      command: 'node build/src/server.js',
      cwd: apiDirectory,
      url: 'http://127.0.0.1:8017/V1/status',
      reuseExistingServer: false,
      timeout: 30_000,
      env: {
        ...process.env,
        MONGODB_URI: process.env.MONGODB_TEST_URI,
        DATABASE_NAME: databaseName,
        BUILD_MODE: 'test',
        HOST: '127.0.0.1',
        PORT: '8017',
        WEBSITE_DOMAIN: 'http://127.0.0.1:5173',
        WHITELIST_DOMAINS: 'http://127.0.0.1:5173',
        ACCESS_TOKEN_SECRET_SIGNATURE: 'phase0-access-secret',
        ACCESS_TOKEN_LIFE: '1h',
        REFRESH_TOKEN_SECRET_SIGNATURE: 'phase0-refresh-secret',
        REFRESH_TOKEN_LIFE: '14 days'
      }
    },
    {
      command: 'node e2e/staticServer.cjs',
      url: 'http://127.0.0.1:5173/login',
      reuseExistingServer: false,
      timeout: 30_000
    }
  ]
})
