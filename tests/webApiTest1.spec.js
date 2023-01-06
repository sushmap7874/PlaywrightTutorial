const {test, expect, request} = require('@playwright/test');
const requestLoginData = {
    userEmail: "ronak231@gmail.com",
    userPassword: "Ronak@7874"
};
const placeOrderPayload = {orders: [{
    country: "Benin", productOrderedId: "6262e95ae26b7e1a10e89bf0"}]
};

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


test('@API Login with token by setting up in local storage', async ({ page }) => {

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