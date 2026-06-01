//Workflow 1: Edit Billing Address
// Step 0 - Login
// Step 1- Navigate to Address page
// Step 2 - Verify the Billing address section is visible
// Step 3 - Click Edit Billing address
// Step 4 — Understand that this is an update scenario because fields are already pre-filled
// Step 5 — Update First Name
// Step 6 — Update Last Name
// Step 7 — Update Street Address
// Step 8 — Update City
// Step 9 — Select Country from the dropdown
// Step 10 — Save the changes
// Step 11 — Verify the updated address is displayed


import { test, expect } from '@playwright/test';

test("Workflow 1: Edit Billing Address", async ({ page }) => {

    // ── Step 0: Login ──────────────────────────────────────────
    await page.goto("https://qa-cart.com/")

    // Replace with your own credentials
    await page.getByLabel("Username or email address").fill("anuradha.learn@gmail.com");
    await page.getByRole('textbox', { name: "Password" }).fill("Play@1234#$");
    await page.getByRole("button", { name: 'LOG IN' }).click();
    await expect(page.getByLabel('Account pages').getByRole('link', { name: 'Log out' })).toBeVisible()


    // Step 1- Navigate to Address page
    await page.goto("https://qa-cart.com/edit-address");

    // Step 2 - Verify the Billing address section is visible
    await expect(page.getByRole('heading', { name: 'Billing address' })).toBeVisible()

    // Step 3 - Click Edit Billing address
    await page.getByRole("link", { name: "Edit Billing address" }).click()
    await expect(page.getByRole('heading', { name: 'Billing address' })).toBeVisible()


    // Step 4 — Understand that this is an update scenario because fields are already pre-filled
    // ── Step 4: Fill form fields ──────────────────────────────
    await page.getByLabel('First name').fill('Anuradha');
    await page.getByLabel('Last name').fill('Agarwal');
    await page.getByLabel('Street address').fill('123 Test Street');
    await page.getByLabel('Town / City').fill('Dubai')

    // // Step 9 — Select Country from the dropdown
    // await page.getByLabel('Country / Region').selectOption({ value: 'AE' });
    await page.locator("#billing_country").selectOption({ value: 'AE' });


    // Step 10 — Save the changes 
    await page.getByRole('button', { name: 'SAVE ADDRESS' }).click();

    // Step 11 — Verify success message and updated address
    await expect(page.getByText("Address changed successfully.")).toBeVisible()

    //billing address
    const billingSection = page.locator('[class*="woocommerce-Address"]')
    await expect(billingSection.locator("address")).toContainText("123 Test Street")

    await page.getByLabel('Account pages').getByRole('link', { name: 'Log out' }).click()
    await expect(page.getByRole("button", { name: 'LOG IN' })).toBeVisible()

    await page.pause()

});