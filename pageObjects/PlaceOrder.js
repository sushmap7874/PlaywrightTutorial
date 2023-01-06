const {expect} = require('@playwright/test');

class PlaceOrder {
    constructor(page) {
        this.page = page;
        this.productTitle = page.locator('div.item__title');
        this.placeOrderBtn = page.locator('div.actions a');
        this.selectCountry = page.locator('[placeholder="Select Country"]');
        this.selectCountryOptions = page.locator('.ta-results');
        this.successMsg = page.locator('.hero-primary');
        this.orderId = page.locator('.em-spacer-1 .ng-star-inserted');
    }

    async verifyProductOnPlaceOrder(productName) {
        const productTitleOnCheckout = await this.productTitle.textContent();
        expect(productTitleOnCheckout.trim()).toEqual(productName);
    }

    async fillOrderDetails(searchCountryText, country) {
        await this.placeOrderBtn.isVisible();
        await this.selectCountry.type(searchCountryText, { delay: 100 });
        await this.selectCountryOptions.waitFor();

        const optionSelectCountry = await this.selectCountryOptions.locator('button').allTextContents();
        const countryIndex = optionSelectCountry.indexOf(country);
        await this.selectCountryOptions.locator('button').nth(countryIndex).click(); 
    }

    async clickOnPlaceOrderBtn() {
        await Promise.all([
            this.page.waitForNavigation(),
            this.placeOrderBtn.click(),
        ]);
        await expect(this.successMsg).toHaveText(' Thankyou for the order. ');
    }

    async getOrderId() {
        let orderId = await this.orderId.textContent();
        orderId = orderId.split(' ')[2];
        console.log(orderId);
        return orderId;
    }
}

module.exports = { PlaceOrder };