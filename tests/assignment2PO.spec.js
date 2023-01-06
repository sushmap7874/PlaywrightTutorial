const {test} = require('@playwright/test');
const {LoginPage} = require('../pageObjects/LoginPage');
const {HomePage} = require('../pageObjects/HomePage');
const {CartPage} = require('../pageObjects/CartPage');
const {PlaceOrder} = require('../pageObjects/PlaceOrder');
const { OrderHistoryPage } = require('../pageObjects/OrderHistoryPage');
const data = JSON.parse(JSON.stringify(require('../utils/data.json')));

test('@web E2E flow to order an item from ecommerce site', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homepage = new HomePage(page);
    const cartPage = new CartPage(page);
    const placeOrder = new PlaceOrder(page);
    const orderHistoryPage = new OrderHistoryPage(page);
    // page.route('**/*.{jpg,png,jpeg}', route => route.abort());
    page.on('request', request => console.log(request.url()));
    page.on('response', response => console.log(response.url(), response.status()));

    await loginPage.goto();
    await loginPage.loginUser(data.usersCred[0].emailId, data.usersCred[0].password);
    await homepage.addProductInCart(data.product[0].productName);
    await homepage.navigateToCartPage();
    await cartPage.verifyProductOnCart(data.product[0].productName);
    await cartPage.verifyAndClickOnCheckoutBtn();
    await placeOrder.verifyProductOnPlaceOrder(data.product[0].productName);
    await placeOrder.fillOrderDetails('ind', ' India');
    await placeOrder.clickOnPlaceOrderBtn();
    const orderId = await placeOrder.getOrderId();
    await homepage.navigateToMyOrdersPage();
    await orderHistoryPage.verifyAndViewOrderByOrderId(orderId);
});