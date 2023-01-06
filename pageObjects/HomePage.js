const {expect} = require('@playwright/test');

class HomePage {
    constructor(page) {
        this.page = page;
        this.productTitle = page.locator('.card-body b');
        this.productBox = page.locator('div.card-body');
        this.addToCartBtn = page.locator('[routerlink*="cart"]');
        this.myOrderBtn = page.locator('button[routerlink*="myorders"]');
        this.myOrderTitle = page.locator('h1.ng-star-inserted');

    }

    async addProductInCart(productName) {
        const getAllProducts = await this.productTitle.allTextContents();
        const productIndex = getAllProducts.indexOf(productName);
        const actualProductLocator = this.productBox.nth(productIndex);

        // add product to the cart & go to the cart and verify the added element
        await actualProductLocator.locator('text= Add To Cart').click();
    }

    async navigateToCartPage() {
        await Promise.all([
            this.page.waitForNavigation(),
            this.addToCartBtn.click(),
        ]);
    }

    async navigateToMyOrdersPage() {
        await this.myOrderBtn.isVisible();
        await Promise.all([
            this.page.waitForNavigation(),
            this.myOrderBtn.click(),
        ]);
        await expect(this.myOrderTitle).toHaveText('Your Orders');
    }
}

module.exports = { HomePage };