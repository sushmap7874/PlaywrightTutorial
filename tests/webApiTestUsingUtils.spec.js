const {test, expect, request} = require('@playwright/test');
const { APIUtils } = require('../utils/APIUtils');
const requestLoginData = {
    userEmail: "ronak231@gmail.com",
    userPassword: "Ronak@7874"
};
const placeOrderPayload = {orders: [{
    country: "Benin", productOrderedId: "6262e95ae26b7e1a10e89bf0"}]
};

let response;

test.beforeAll( async () => {
    const requestContext = await request.newContext();
    const apiUtils = new APIUtils(requestContext, requestLoginData);
    response = await apiUtils.createOrder(placeOrderPayload);
});


test('@API Place order with API context using utils', async ({ page }) => {

    // setting up user token in local storage using JS method
    page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.token);

    await page.goto('https://rahulshettyacademy.com/client');
    const pageTitle = await page.title();
    expect(pageTitle).toEqual("Let's Shop");    
    await expect(page.locator('i.fa-sign-out')).toBeVisible();

    // Go to order list and verify orderId there
    await page.locator('button[routerlink*="myorders"]').isVisible();
    await Promise.all([
        page.waitForNavigation(),
        page.locator('button[routerlink*="myorders"]').click(),
    ]);
    await expect(page.locator('h1.ng-star-inserted')).toHaveText('Your Orders');
    const listOfOrdersLocator = page.locator('tr.ng-star-inserted');
    const listOfOrderId = await listOfOrdersLocator.locator('th').allTextContents();
    const getCurrentOrderIdIndex = listOfOrderId.indexOf(response.orderId); 

    const yourOrderListRow = listOfOrdersLocator.nth(getCurrentOrderIdIndex);
    await Promise.all([
        page.waitForNavigation(),
        yourOrderListRow.locator('button.btn-primary').click(),
    ]);
    await expect(page.url()).toContain(`${response.orderId}`);
    await expect(page.locator('div[routerlink*="myorders"]')).toHaveText(' View Orders ');
});