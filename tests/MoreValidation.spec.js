const { test, expect } = require('@playwright/test');

test('More validation method of playwright', async({ page }) => {
    await page.goto('https://rahulshettyacademy.com/AutomationPractice/');

    // To validate hide/show element
    await expect(page.locator('[name="show-hide"]')).toBeVisible();
    await page.locator('#hide-textbox').click();
    await expect(page.locator('[name="show-hide"]')).toBeHidden();
    await page.locator('#show-textbox').click();
    await expect(page.locator('[name="show-hide"]')).toBeVisible();

    // To handle Javascript dialog box
    page.on('dialog', dialog => dialog.accept());
    await page.locator('#alertbtn').click();

    // To hover over the elements
    await page.locator('#mousehover').hover();
    await page.locator('.mouse-hover-content').isVisible();

    // Handle frame in playwright
    const framePage = await page.frameLocator('#courses-iframe');
    await framePage.locator('li a[href="lifetime-access"]:visible').click();
    const getPageHeading = await framePage.locator('.text h2').textContent();
    console.log(getPageHeading.split(' ')[1]);

});

test('Screenshot and Partial screenshot', async({ page }) => {
    await page.goto('https://rahulshettyacademy.com/AutomationPractice/');

    // To validate hide/show element
    await expect(page.locator('[name="show-hide"]')).toBeVisible();
    await page.locator('#hide-textbox').click();
    await expect(page.locator('[name="show-hide"]')).toBeHidden();
    await page.locator('#show-textbox').click();
    await page.locator('[name="show-hide"]').screenshot({path: 'partialPageScreenshot.png'});
    await expect(page.locator('[name="show-hide"]')).toBeVisible();

    page.screenshot({path: 'fullpageScreenshot.png'});

});


test('Visual Comparison', async({ page }) => {
    await page.goto('https://flightaware.com/');
    expect(await page.screenshot()).toMatchSnapshot('landing.png');
});