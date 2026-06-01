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
    await page.locator("input[name='username']").fill("anuradha.learn@gmail.com");
    await page.locator("input[name='password']").fill("Play@1234#$");
    await page.locator("button[name='login']").click();
    await expect(page.locator("a[href*='customer-logout']")).toBeVisible()

    // Step 1- Navigate to Address page
    await page.goto("https://qa-cart.com/edit-address");

    // Step 2 - Verify the Billing address section is visible
    await expect(page.locator("h2").filter({hasText:"Billing address"})).toBeVisible()

    // await page.pause()

    // Step 3 - Click Edit Billing address
    await page.locator("a[href*='edit-address/billing/']").click()
    await expect(page.locator("h2").filter({hasText:"Billing address"})).toBeVisible()

   
    
    // Step 4 — Understand that this is an update scenario because fields are already pre-filled
    // Step 5 — Update First Name   
    await page.locator("#billing_first_name").fill("Anu")
    
    // Step 6 — Update Last Name
    await page.locator("#billing_last_name").fill("Agarwal");

    // Step 7 — Update Street Address
    await page.locator("#billing_address_1").fill("123 Test Street");

    // Step 8 — Update City
    await page.locator("#billing_city").fill("Dubai");
  
   
    // // Step 9 — Select Country from the dropdown
    // await page.locator("#billing_country").selectOption({ value: "GB" });


    // Step 10 — Save the changes 
    await page.locator("button[name='save_address']").click()
    
    // Step 11 — Verify success message and updated address
    await expect(page.locator(".woocommerce-message")).toContainText("Address changed successfully")

   //billing address
    const billingSection=page.locator('[class*="woocommerce-Address"]')
    await expect(billingSection.locator("address")).toContainText("123 Test Street")
    await page.pause()

});