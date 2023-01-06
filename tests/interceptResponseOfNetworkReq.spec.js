const {test, expect, request} = require('@playwright/test');
const requestLoginData = {
    userEmail: "ronak231@gmail.com",
    userPassword: "Ronak@7874"
};
const placeOrderPayload = {orders: [{
    country: "Benin", productOrderedId: "6262e95ae26b7e1a10e89bf0"}]
};
const fakeOrdersDataPayload = {
    data: [],
    message: "No Orders",
}

let token;
let orderId;

test.beforeAll( async () => {
    const requestContext = await request.newContext();
    const requestResponse = await requestContext.post('https://rahulshettyacademy.com/api/ecom/auth/login', {
        data: requestLoginData
    });
    expect(requestResponse.status()).toEqual(200);
    token = (await requestResponse.json()).token;
    console.log("🚀 ~ file: webApiTest1.spec.js:14 ~ test.beforeAll ~ token", token);

    const orderResponse = await requestContext.post('https://rahulshettyacademy.com/api/ecom/order/create-order', {
        data: placeOrderPayload,
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        }
    });

    const orderResJson = await orderResponse.json();
    console.log("🚀 ~ file: webApiTest1.spec.js:31 ~ test.beforeAll ~ orderResJson", orderResJson);
    orderId = orderResJson.orders[0];
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

    await page.route('https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/638cc36303841e9c9a4a065c', async route => {
        const response = await page.request.fetch(route.request());
        let body = fakeOrdersDataPayload;
        await route.fulfill(
            {
                response,
                body,
            }
        );
    });

    // Go to order list and verify orderId there
    await page.locator('button[routerlink*="myorders"]').isVisible();
    await Promise.all([
        page.waitForNavigation(),
        page.locator('button[routerlink*="myorders"]').click(),
    ]);
    await expect(page.locator('button[routerlink="/dashboard"]')).toHaveText('Go Back to Shop');
});