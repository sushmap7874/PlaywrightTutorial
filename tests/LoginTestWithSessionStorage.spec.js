const {test, expect} = require('@playwright/test');
let webContext;

test.beforeAll(async({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://rahulshettyacademy.com/client');
    
    // Verify login button and enter username and password
    await expect(page.locator('#login')).toBeVisible();
    await page.locator('#userEmail').fill('ronak231@gmail.com');
    await page.locator('#userPassword').fill('Ronak@7874');

    await Promise.all([
        page.waitForNavigation(),
        page.locator('#login').click(),
    ]);

    // verify user navigates to home page and find the product to buy
    await expect(page.locator('i.fa-sign-out')).toBeVisible();
    await context.storageState({ path: 'loginState.json' });
    webContext = await browser.newContext({
        storageState: 'loginState.json'
    });
});

test('E2E flow to order an item from ecommerce site', async () => {
    const product = 'zara coat 3';
    const placeOrderLocator = 'div.actions a';
    const page = await webContext.newPage();
    await page.goto('https://rahulshettyacademy.com/client');
    const pageTitle = await page.title();
    expect(pageTitle).toEqual("Let's Shop");

    // verify user navigates to home page and find the product to buy
    await expect(page.locator('i.fa-sign-out')).toBeVisible();
    const getAllProducts = await page.locator('.card-body b').allTextContents();
    console.log("🚀 ~ file: assignment_2.spec.js:23 ~ test.only ~ getAllProducts", getAllProducts);
    const productIndex = getAllProducts.indexOf(product);
    const actualProductLocator = page.locator('div.card-body').nth(productIndex);

    // add product to the cart & go to the cart and verify the added element
    await actualProductLocator.locator('text= Add To Cart').click();
    await Promise.all([
        page.waitForNavigation(),
        page.locator('[routerlink*="cart"]').click(),
    ]);
    await expect(page.locator('text=My Cart')).toBeVisible();
    page.locator('li.items').first().waitFor();
    const isItemVisible = await page.locator(`h3:has-text('zara coat 3')`).isVisible();
    expect(isItemVisible).toBeTruthy();

    // go to the checkout page and fill some billing information
    await Promise.all([
        page.waitForNavigation(),
        page.locator('.subtotal button').click(),
    ]);
    const productTitleOnCheckout = await page.locator('div.item__title').textContent();
    expect(productTitleOnCheckout.trim()).toEqual(product);

    await page.locator(placeOrderLocator).isVisible();
    await page.locator('[placeholder="Select Country"]').type('ind', { delay: 100 });
    const autoSelectCountryOptions = page.locator('.ta-results');
    await autoSelectCountryOptions.waitFor();

    const optionSelectCountry = await autoSelectCountryOptions.locator('button').allTextContents();
    const countryIndex = optionSelectCountry.indexOf(' India');
    await autoSelectCountryOptions.locator('button').nth(countryIndex).click(); 

    // fill credit card information and place the order
    await Promise.all([
        page.waitForNavigation(),
        page.locator(placeOrderLocator).click(),
    ]);

    await expect(page.locator('.hero-primary')).toHaveText(' Thankyou for the order. ');
    let orderId = await page.locator('.em-spacer-1 .ng-star-inserted').textContent();
    orderId = orderId.split(' ')[2];
    console.log(orderId);

    // Go to order list and verify orderId there
    await page.locator('button[routerlink*="myorders"]').isVisible();
    await Promise.all([
        page.waitForNavigation(),
        page.locator('button[routerlink*="myorders"]').click(),
    ]);
    await expect(page.locator('h1.ng-star-inserted')).toHaveText('Your Orders');
    const listOfOrdersLocator = page.locator('tr.ng-star-inserted');
    const listOfOrderId = await listOfOrdersLocator.locator('th').allTextContents();
    const getCurrentOrderIdIndex = listOfOrderId.indexOf(orderId); 

    const yourOrderListRow = listOfOrdersLocator.nth(getCurrentOrderIdIndex);
    await Promise.all([
        page.waitForNavigation(),
        yourOrderListRow.locator('button.btn-primary').click(),
    ]);
    await expect(page.url()).toContain(`${orderId}`);
    await expect(page.locator('div[routerlink*="myorders"]')).toHaveText(' View Orders ');
});