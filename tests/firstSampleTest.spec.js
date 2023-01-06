const {test, expect} = require('@playwright/test');

test('@web First sample test with browser fixture', async ({ browser }) => {
    // Sample test with browser fixture

    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://www.google.com/');
    const title = await page.title();
    console.log("title====", title);
});

test('Second sample test without browser fixture', async ({ page }) => {
    // Sample test without browser fixture

    await page.goto('https://www.google.com/');
    const title = await page.title();
    expect(title).toEqual("Google");
    console.log("title====", title);
});