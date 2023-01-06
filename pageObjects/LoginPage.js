const { expect } = require('@playwright/test');

class LoginPage {
    constructor(page) {
        this.page = page;
        this.loginBtn = page.locator('#login');
        this.registerLoc = page.locator('a.text-reset');
        this.firstName = page.locator('[placeholder="First Name"]');
        this.lastName = page.locator('[placeholder="Last Name"]');
        this.email = page.locator('[type="email"]');
        this.mobileNumber = page.locator('#userMobile');
        this.occupationSelect = page.locator('.custom-select');
        this.gender = page.locator('[value="Male"]');
        this.tos = page.locator('[formcontrolname="required"]');
        this.passwd = page.locator('#userPassword');
        this.confirmPasswd = page.locator('#confirmPassword');
        this.registerBtn = page.locator('[value="Register"]');
        this.signOutBtn = page.locator('i.fa-sign-out');

    }

    async goto() {
        const url = 'https://rahulshettyacademy.com/client';
        await this.page.goto(url);
        const pageTitle = await this.page.title();
        expect(pageTitle).toEqual("Let's Shop");
    }

    async registerUser() {
        // Verify login button and navigate to sign up model
        await expect(this.loginBtn).toBeVisible();
        await expect(this.registerLoc).toContainText('Register here');
        await this.registerLoc.click();

        // Sign up for the user
        await expect(this.loginBtn).toContainText('Register');
        await this.firstName.type("Ronakshi");
        await this.lastName.type("Singh");
        await this.email.type("ronakashi231@gmail.com");
        await this.mobileNumber.type("9764736483");

        // Handle dropdown control
        await this.occupationSelect.selectOption('3: Engineer');

        // Handle radio button controls
        await this.gender.click();
        expect( this.gender).toBeChecked();

        // Handle checkbox controls
        await this.tos.click();
        expect(this.tos).toBeChecked();

        // To uncheck checkbox
        // await page.locator('[formcontrolname="required"]').uncheck();
        // expect(await page.locator('[formcontrolname="required"]').isChecked()).toBeFalsy();

        await this.passwd.type('Ronak@7874');
        await this.confirmPasswd.type('Ronak@7874');

        await this.registerBtn.click();
        const getSuccessMsg = await this.page.locator('h1.headcolor').textContent();
        expect(getSuccessMsg).toEqual('Account Created Successfully');
    }

    async loginUser(emailId, password) {
        // Verify login button and enter username and password
        await expect(this.loginBtn).toBeVisible();
        await this.email.fill(emailId);
        await this.passwd.fill(password);

        await Promise.all([
            this.page.waitForNavigation(),
            this.loginBtn.click(),
        ]);
        await expect(this.signOutBtn).toBeVisible();
    }
}

module.exports = {LoginPage};