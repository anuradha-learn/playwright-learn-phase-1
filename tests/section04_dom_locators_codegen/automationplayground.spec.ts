import { test, expect } from '@playwright/test'

test('Fill Automation Playground Fields', async ({ page }) => {
    await page.goto('https://www.anuradhaagarwal.com/automationplayground')

    // First Name
    await page.locator('input[name="first-name"]').fill("Anuradha")
    await expect(page.locator('input[name="first-name"]')).toHaveValue('Anuradha')

    // Email — placeholder because name='email' is not unique
    await page.locator("input[placeholder='example@domain.com']").fill('test@email.com');
    await expect(page.locator("input[placeholder='example@domain.com']")).toHaveValue('test@email.com');

    //feedback textarea
    const feedback = page.locator("textarea[placeholder='How can we improve?']")
    await feedback.pressSequentially("This is my feedback", { delay: 30 })
    await expect(feedback).toHaveValue("This is my feedback");

})