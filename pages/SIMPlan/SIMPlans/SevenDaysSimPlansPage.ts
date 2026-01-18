import { expect, Page } from "@playwright/test";
import { testData } from '../../../utils/testData';

export class SevenDaysSimPlansPage{
    constructor(private page: Page) {}

    async openPlanPage(){
        console.log("Navigating to amaysim homepage");
        // Load amaysim website
        await this.page.goto("https://www.amaysim.com.au",{ waitUntil: "load" });
    }

    async buySevenDayPlan(){
        //Click SIM Plans 
        await this.page.getByRole("link", {name: "SIM Plans"}).click();
        console.log("Buying 7 Day Sim Plan");

        // Click the 7 DAY SIM PLANS buy now button
        await this.page.locator('a[href="/mobile/cart/7-day-10gb"]').click();

        // Wait for $10/7 days header
        await this.page.locator("#product-header-price-desktop").waitFor({ state: "visible" });

        // Assert that page is on the $10/7 Plan page
        await expect(this.page.locator("#product-header-price-desktop")).toHaveText("$10/7 days");
    }

    async checkOutPlan(){
        //Pick a new number
        await this.page.locator('label:has-text("pick a new number")').first().click();

        // Locate the generated phone number
        const newNumberLocator = this.page.locator("span[data-new-number]");

         // Wait until it appears
        const newNumber = await newNumberLocator.innerText();
        console.log({"New number selected: " :newNumber});

        // Add a Promo
        // await this.page.getByTestId("promo-code").fill("");
        // await this.page.locator('button[type="submit"]').click();

        // Choose physical sim
        await this.page.locator('label:has(input[name="simType"][value="USIM"])').click();
        // Choose E-SIM
        // await this.page.locator('label:has(input[name="simType"][value="ESIM"])').click();

        // Click checkout buttom
        await this.page.getByTestId("product-checkout-button").click();
        console.log("SIM plan checkout done. Proceeding to payment")
    }

    async userDetails(){
        // Choose I'm new to Amaysim
        await this.page.locator('label:has(input[name="isExistingUser"][value="no"])').click();

        const titleInput = this.page.getByTestId("title-selector");

        // Trigger the dropdown
        await titleInput.fill("Mr");

        // Wait for the dropdown option to appear
        const mrOption = this.page.getByTestId("provider-option-mr");
        await mrOption.waitFor({ state: "visible" });

        // Click the option to select it
        await mrOption.click();

        // Assert the input now has Mr
        await expect(titleInput).toHaveValue("Mr");

        // Input user details
        await this.page.fill('input[name="firstName"]', testData.user.firstName);
        await this.page.fill('input[name="lastName"]', testData.user.lastName);
        await this.page.fill('input[name="dateOfBirth"]', testData.user.dateOfBirth);
        await this.page.fill('input[name="email"]', testData.user.email);
        await this.page.fill('input[name="password"]', testData.user.password);
        await this.page.fill('input[name="contactNumber"]', testData.user.contactNumber);
        await this.page.fill('input[placeholder="e.g 123 George St Sydney NSW 2000"]', testData.user.address);
        await this.page.locator("#react-autowhatever-1--item-0").click();

        // Assert that address is correctly chosen
        expect(this.page.locator(`input[placeholder="${testData.user.address}"]`));
        console.log("User details have been inputted. Proceeding to Card Payment ");
    }

    async rejectPayment(){
        //Choose card
        //await this.page.locator('iframe[name="__privateStripeFrame0345"]').contentFrame().getByTestId('card').click();
        //await this.page.locator('iframe[name="__privateStripeFrame3315"]').contentFrame().getByTestId('card').click();
        // await this.page.frameLocator('iframe[src*="stripe.com"]').getByTestId('card').click();
        // const frameLocator = this.page.frameLocator('[data-testid="iframe"]');
        // await frameLocator.getByTestId("card").click();
        const frameLocator = this.page.frameLocator('iframe[title="Secure payment input frame"]');
        await frameLocator.locator('[data-testid="card"]').click();

        //Input card details
        await frameLocator.locator('#Field-numberInput').fill(testData.payment.cardNumber);
        await frameLocator.locator('#Field-expiryInput').fill(testData.payment.expiry);
        await frameLocator.locator('#Field-cvcInput').fill(testData.payment.cvc);
        
        //Assert that pay button is disabled
        expect(this.page.getByRole('button', { name: "pay now" }).isDisabled());

        //Accept Terms and Condition
        await this.page.locator('input[name="acceptTermsAndConditions"]').dispatchEvent("click");
       
        //Assert that pay button is disabled
        expect(this.page.getByRole('button', { name: "pay now" }).isEnabled());
        //Click pay button
        await this.page.getByRole('button', { name: "pay now" }).dispatchEvent("click");

        await expect(this.page.locator('span.css-qib644', { hasText: 'Credit Card payment failed' })).toBeVisible();
        console.log("Payment method failed.");
    }
}