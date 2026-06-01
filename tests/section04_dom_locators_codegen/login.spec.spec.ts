import { test, expect } from '@playwright/test';

test("Login to qa-cart.com", async ({ page }) => {

    await page.goto("https://qa-cart.com/");

    // Replace with your own credentials
    await page.locator("input[name='username']").fill("anuradha.learn@gmail.com");
    await page.locator("input[name='password']").fill("Play@1234#$1");
    await page.locator("button[name='login']").click();
    await expect(page.locator("a[href*='customer-logout']")).toBeVisible()
});