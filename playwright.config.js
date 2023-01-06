// @ts-check
const { devices } = require('@playwright/test');

const config = {
  testDir: './tests',
  /* Maximum time one test can run for. */
  timeout: 100 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000
  },
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    browserName : "chromium", // To run on different browsers such as 'chromium', 'firefox' & 'webkit'
    headless: false, // To run in headless or hadful mode
    screenshot: 'on', // To save screenshot of tests
    trace: 'on', // To trace the test logs// on/off
    // ...devices['iPhone 11 Pro Max'],// To run the test on mobile devices
    video: 'retain-on-failure'
  },
};

module.exports = config;
