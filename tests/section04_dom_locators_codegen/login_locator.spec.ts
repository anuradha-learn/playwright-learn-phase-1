import { test, expect } from '@playwright/test';

test("Login to qa-cart.com", async ({ page }) => {

    await page.goto("https://qa-cart.com/");

    // Replace with your own credentials
    await page.getByLabel("Username or email address").fill("anuradha.learn@gmail.com");
    await page.getByRole('textbox',{name:"Password"}).fill("Play@1234#$");
    await page.getByRole("button",{name:'LOG IN'}).click();
    await expect(page.getByLabel('Account pages').getByRole('link', { name: 'Log out' })).toBeVisible()
    await page.pause()
 
});