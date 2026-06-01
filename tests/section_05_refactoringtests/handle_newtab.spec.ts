// import { test, expect } from '@playwright/test';
// const loginData = {
//     user: 'anuradha.learn@gmail.com',
//     password: 'Play@1234#$',
//     baseUrl: 'https://qa-cart.com/',
// };

// const testData = {

//     product: {
//         name: 'Assorted Coffee',
//         expectedUrl: /assorted-coffee/
//     }

// };
// test.beforeEach(async ({ page }) => {

//     await page.goto(loginData.baseUrl);

//     await page.getByRole('textbox', {
//         name: 'Username or email address'
//     }).fill(loginData.user);

//     await page.getByRole('textbox', {
//         name: 'Password'
//     }).fill(loginData.password);

//     await page.getByRole('button', {
//         name: 'Log in'
//     }).click();

//     await expect(
//         page.getByLabel('Account pages')
//             .getByRole('link', { name: 'Log out' })
//     ).toBeVisible();

// });

// test('View product details in new tab', async ({ page }) => {
//     await test.step('Navigate to DemoShop', async () => {

//         await page.getByRole('link', {
//             name: 'DemoShop'
//         }).click();

//         await expect(page).toHaveURL(/shop/);

//     });
//     // page.context().waitForEvent('page')
//     await test.step('Open product details and validate', async () => {
//         const productLink = page.getByRole('link', { name: testData.product.name }).first()
//         await expect(productLink).toHaveAttribute('target', '_blank')
//         const [productTab] = await Promise.all([page.context().waitForEvent('page'),
//         productLink.click()])
//         // console.log(productTab)
//         await productTab.waitForLoadState()
//         await expect(productTab.getByRole('heading', { name: testData.product.name }))
//             .toBeVisible()
//         await expect(productTab).toHaveURL(testData.product.expectedUrl)
//         await productTab.close()
//     })
// })

import { test, expect } from '@playwright/test';

// ─────────────────────────────────────────────
// Login Test Data
// ─────────────────────────────────────────────
const loginData = {
    user: 'anuradha.learn@gmail.com',
    password: 'Play@1234#$',
    baseUrl: 'https://qa-cart.com/',
};

// ─────────────────────────────────────────────
// Product Test Data
// ─────────────────────────────────────────────
const testData = {
    product: {
        name: 'Assorted Coffee',
        expectedUrl: /assorted-coffee/
    }
};

// ─────────────────────────────────────────────
// Precondition:
// Login before every test execution
// ─────────────────────────────────────────────
test.beforeEach(async ({ page }) => {

    // Navigate to application
    await page.goto(loginData.baseUrl);

    // Enter username
    await page.getByRole('textbox', {
        name: 'Username or email address'
    }).fill(loginData.user);

    // Enter password
    await page.getByRole('textbox', {
        name: 'Password'
    }).fill(loginData.password);

    // Click Login button
    await page.getByRole('button', {
        name: 'Log in'
    }).click();

    // Verify successful login
    await expect(
        page.getByLabel('Account pages')
            .getByRole('link', { name: 'Log out' })
    ).toBeVisible();

});

// ─────────────────────────────────────────────
// Test: View Product Details in New Tab
// ─────────────────────────────────────────────
test('View product details in new tab', async ({ page }) => {

    // Step 1: Navigate to DemoShop page
    await test.step('Navigate to DemoShop', async () => {

        await page.getByRole('link', {
            name: 'DemoShop'
        }).click();

        // Verify user reaches Shop page
        await expect(page).toHaveURL(/shop/);
    });

    // page.context().waitForEvent('page')

    // Step 2: Open product in a new tab and validate details
    await test.step('Open product details and validate', async () => {

        // Locate the product link
        const productLink = page
            .getByRole('link', { name: testData.product.name })
            .first();

        // Verify the link is configured to open in a new tab
        await expect(productLink).toHaveAttribute('target', '_blank');

        // Listen for the new page event BEFORE clicking the link
        // Promise.all prevents a race condition where the tab opens
        // before Playwright starts listening for it.
        const [productTab] = await Promise.all([
            page.context().waitForEvent('page'),
            productLink.click()
        ]);

        // console.log(productTab)

        // Wait until the new page finishes loading
        await productTab.waitForLoadState();

        // Verify product heading is displayed
        await expect(
            productTab.getByRole('heading', {
                name: testData.product.name
            })
        ).toBeVisible();

        // Verify correct product page URL
        await expect(productTab)
            .toHaveURL(testData.product.expectedUrl);

        // Close the product tab
        await productTab.close();
    });
});