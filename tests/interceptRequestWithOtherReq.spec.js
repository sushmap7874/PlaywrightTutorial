const {test, expect, request} = require('@playwright/test');
const requestLoginData = {
    userEmail: "roshni@gmail.com",
    userPassword: "Roshni@123"
};

let token;

test.beforeAll( async () => {
    const requestContext = await request.newContext();
    const requestResponse = await requestContext.post('https://rahulshettyacademy.com/api/ecom/auth/login', {
        data: requestLoginData
    });
    expect(requestResponse.status()).toEqual(200);
    token = (await requestResponse.json()).token;
    console.log("🚀 ~ file: webApiTest1.spec.js:14 ~ test.beforeAll ~ token", token);
});


test('To intercept the request call for order and send fake response', async ({ page }) => {

    // setting up user token in local storage using JS method
    page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, token);

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

    await page.route('https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=63b2eb0703841e9c9a67ba99', async route =>
        route.continue({
            url: 'https://rahulshettyacademy.com/api/ecom/user/get-cart-count/638cc36303841e9c9a4a065c'
        }),
    );
    await page.locator('button:has-text("View")').first().click();
});