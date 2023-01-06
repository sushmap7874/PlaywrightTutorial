const {expect} = require('@playwright/test');

class CartPage {
    constructor(page) {
        this.page = page;
        this.checkoutBtn = page.locator('.subtotal button');
        this.productItems = page.locator('li.items');
    }

    async verifyProductOnCart(productName) {
        this.productItems.first().waitFor();
        const isItemVisible = await this.page.locator(`h3:has-text('${productName}')`).isVisible();
        expect(isItemVisible).toBeTruthy();
    }

    async verifyAndClickOnCheckoutBtn() {
         // go to the checkout page and fill some billing information
        await Promise.all([
            this.page.waitForNavigation(),
            this.checkoutBtn.click(),
        ]);
    }
}

module.exports = { CartPage };