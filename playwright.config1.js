// @ts-check
const { devices } = require('@playwright/test');

const config = {
  testDir: './tests',
  /* Maximum time one test can run for. */
  timeout: 100 * 1000,
  // retries: 1,
  workers: 1,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000
  },
  reporter: 'html',
  projects: [
    {
      name: "safari",
      use: {
        browserName : "webkit", // To run on different browsers such as 'chromium', 'firefox' & 'webkit'
        headless: true, // To run in headless or hadful mode
        screenshot: 'on', // To save screenshot of tests
        trace: 'on', // To trace the test logs// on/off
        video: 'retain-on-failure'
      },
    },
    {
      name: 'firefox',
      use: {
        browserName : "firefox", // To run on different browsers such as 'chromium', 'firefox' & 'webkit'
        headless: false, // To run in headless or hadful mode
        screenshot: 'on', // To save screenshot of tests
        trace: 'on', // To trace the test logs// on/off
        viewport: { width: 775, height: 720 } // To run the test on given viewports
      },
    }
  ]
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
 
};

module.exports = config;
