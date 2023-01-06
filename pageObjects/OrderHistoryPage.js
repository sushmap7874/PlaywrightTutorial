const {expect} = require('@playwright/test');

class OrderHistoryPage {
    constructor(page) {
        this.page = page;
        this.orders = page.locator('tr.ng-star-inserted');
        this.orderDetail = page.locator('div[routerlink*="myorders"]');
    }

    async verifyAndViewOrderByOrderId(orderId) {
        const listOfOrdersLocator = this.orders;
        const listOfOrderId = await listOfOrdersLocator.locator('th').allTextContents();
        const getCurrentOrderIdIndex = listOfOrderId.indexOf(orderId); 

        const yourOrderListRow = listOfOrdersLocator.nth(getCurrentOrderIdIndex);
        await Promise.all([
            this.page.waitForNavigation(),
            yourOrderListRow.locator('button.btn-primary').click(),
        ]);
        await expect(this.page.url()).toContain(`${orderId}`);
        await expect(this.orderDetail).toHaveText(' View Orders ');
    }
}

module.exports = { OrderHistoryPage };