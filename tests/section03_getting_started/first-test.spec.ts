import { test, expect } from '@playwright/test'

test("Load Home Page", async ({ page }) => {
    await page.goto("http://qa-cart.com")
    await expect(page).toHaveTitle(
        "QA TEST AUTOMATION DEMO STORE BY ANURADHA AGARWAL")
    // await page.locator(".add-to-cart").click();
    // await page.locator(".product-item").first().click();
    // await expect(page.locator(".cart-count")).toHaveText("1");
})