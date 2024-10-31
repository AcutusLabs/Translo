import path from "path"
import { devices, PlaywrightTestConfig } from "@playwright/test"

// Use process.env.PORT by default and fallback to port 8080
const PORT = 3000

// Set webServer.url and use.baseURL with the location of the WebServer respecting the correct set port
export const baseURL = `http://localhost:${PORT}`

// Reference: https://playwright.dev/docs/test-configuration
const config: PlaywrightTestConfig = {
  // Timeout per test
  globalTimeout: 60 * 60 * 1000,

  testDir: path.join(__dirname, "tests/e2e"),
  snapshotPathTemplate: "{testDir}/__screenshots__/{testFilePath}/{arg}{ext}",

  workers: 2,
  retries: 1,

  outputDir: "test-results/",

  // Run your local dev server before starting the tests:
  // https://playwright.dev/docs/test-advanced#launching-a-development-web-server-during-the-tests
  webServer: {
    command: "pnpm dev",
    url: baseURL,
    reuseExistingServer: false,
  },

  reporter: [["html", { outputFolder: "playwright-report" }]],

  fullyParallel: true,

  use: {
    // Use baseURL so to make navigations relative.
    // More information: https://playwright.dev/docs/api/class-testoptions#test-options-base-url
    baseURL,

    // Retry a test if its failing with enabled tracing. This allows you to analyse the DOM, console logs, network traffic etc.
    // More information: https://playwright.dev/docs/trace-viewer
    trace: "retry-with-trace",

    // All available context options: https://playwright.dev/docs/api/class-browser#browser-new-context
    contextOptions: {
      ignoreHTTPSErrors: true,
    },

    viewport: { width: 1920, height: 1040 },
    // during navigation
    ignoreHTTPSErrors: true,

    // capture screenshot on failure
    screenshot: "only-on-failure",
    video: "retain-on-failure",

    launchOptions: {
      slowMo: 0, // 500 for debug
    },
  },

  projects: [
    {
      name: "Desktop Chrome",
      use: {
        ...devices["Desktop Chrome"],
      },
      fullyParallel: true,
    },
    // {
    //   name: 'Desktop Firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //   },
    // },
    // {
    //   name: 'Desktop Safari',
    //   use: {
    //     ...devices['Desktop Safari'],
    //   },
    // },

    // Test against mobile viewports.
    // {
    //   name: 'Mobile Chrome',
    //   use: {
    //     ...devices['Pixel 5'],
    //   },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: devices['iPhone 12'],
    // },
  ],
}

export default config
