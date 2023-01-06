const { test, expect } = require('@playwright/test');
const {LoginPage} = require('../pageObjects/LoginPage');

// To debug the test run "npx playwright test --debug" command

test('Assignment 1', async ({ page }) => {

    const loginPage = new LoginPage(page);

    // Go to shopping site and verify page title
    await loginPage.goto();
    await loginPage.registerUser();
    
});

test('blinking text', async ({ page }) => {
  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
  const blinkingTextLocator = page.locator('a[href*="documents-request"]');
  await expect(blinkingTextLocator).toHaveAttribute('class', 'blinkingText');
});

test('@web Handle child windows and tabs', async ({browser}) => {
    const context = await browser.newContext();
    const basePage = await context.newPage();

    await basePage.goto('https://rahulshettyacademy.com/loginpagePractise/');
    const blinkingTextLocator = basePage.locator('a[href*="documents-request"]');

    const [secondPage] = await Promise.all([
        context.waitForEvent('page'),
        blinkingTextLocator.click(),
    ]);

    const text = await secondPage.locator('.red').textContent();
    const getEmail = text.split('@')[1].split(' ')[0];
    console.log(getEmail);

    await basePage.locator('#username').type(getEmail);
});
