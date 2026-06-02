import { test, expect } from '@playwright/test';

// ======================================================
// Test Configuration Data
// ======================================================

// Login credentials and application URL
const loginData = {
    user: "anuradha.learn@gmail.com",
    password: "Play@1234#$",
    baseUrl: "https://qa-cart.com/",
};

// Test data used during execution
const testData = {
    search: {
        keyword: 'organic',
        maxPrice: '$25',
    },
};

// Variable used to store generated order ID
let orderId: string | undefined;


// ======================================================
// Common Setup
// Runs before every test
// ======================================================
test.beforeEach(async ({ page }) => {

    // Navigate to application
    await page.goto(loginData.baseUrl);

    // Login using registered user credentials
    await page.getByRole('textbox', {
        name: 'Username or email address'
    }).fill(loginData.user);

    await page.getByRole('textbox', {
        name: 'Password Required'
    }).fill(loginData.password);

    await page.getByRole('button', {
        name: 'Log in'
    }).click();

    // Verify login succeeded
    await expect(
        page.getByLabel('Account pages')
            .getByRole('link', { name: 'Log out' })
    ).toBeVisible();
});


// ======================================================
// Purchase Product Workflow
// ======================================================
test.describe("Checkout — registered user purchase journey @checkout @journey", async () => {

    test(
        'registered user can search, filter, purchase product, and verify order  @smoke @regression @critical',
        async ({ page }) => {

            // ======================================================
            // Step 1: Open DemoShop
            // ======================================================
            await test.step('Open DemoShop page', async () => {

                // Navigate to shop page
                await page.getByRole('link', {
                    name: 'DemoShop'
                }).click();

                // Verify shop page loaded
                await expect(
                    page.getByRole('heading', {
                        name: 'DemoShop'
                    })
                ).toBeVisible();

                // Wait for products to become visible
                const products = page.locator('ul.products li');

                await products.first().waitFor({
                    state: 'visible'
                });
            });


            // ======================================================
            // Step 2: Search Products
            // ======================================================
            await test.step("Search for products", async () => {

                // Enter search keyword
                await page.getByRole('searchbox', {
                    name: 'Search'
                }).fill(testData.search.keyword);

                // Execute search
                await page.getByRole('button', {
                    name: 'Search'
                }).click();

                // Verify search results page appears
                const searchResults = page.getByRole('heading', {
                    name: "Search results"
                });

                await searchResults.waitFor({
                    state: 'visible'
                });

                // Verify search keyword appears in results heading
                const keyword = testData.search.keyword;

                await expect(searchResults)
                    .toContainText(keyword);

                // Validate every displayed product contains search keyword
                const products = page.locator("ul.products li");
                const count = await products.count();

                for (let i = 0; i < count; i++) {

                    const product = products.nth(i);

                    const title =
                        await product.locator("h2").textContent();

                    expect(title?.toLowerCase())
                        .toContain(keyword.toLowerCase());
                }
            });


            // ======================================================
            // Step 3: Apply Price Filter
            // ======================================================
            await test.step('Apply maximum price filter', async () => {

                // Enter maximum price value
                await page.getByRole('textbox', {
                    name: 'Filter products by maximum'
                }).fill(testData.search.maxPrice);

                // Convert string value "$25" to numeric value 25
                const maxPriceNum = Number(
                    testData.search.maxPrice.replace('$', '')
                );

                console.log(maxPriceNum);

                // Wait until filter updates product list
                await page.getByText(`Up to $${maxPriceNum}`)
                    .waitFor({
                        state: 'visible'
                    });

                // Validate every displayed product is within filter range
                const products = page.locator("ul.products li");
                const count = await products.count();

                for (let i = 0; i < count; i++) {

                    const product = products.nth(i);

                    const priceText =
                        await product.locator(".price").textContent();

                    const price = Number(
                        priceText?.replace(/[^0-9.]/g, "")
                    );

                    expect(price)
                        .toBeLessThanOrEqual(maxPriceNum);
                }
            });


            // ======================================================
            // Step 4: Add Product to Cart
            // ======================================================
            await test.step('Add filtered product to cart', async () => {

                const products = page.locator('ul.products li');

                await expect(products.first()).toBeVisible();

                // Select first available filtered product
                const firstProduct = products.first();

                const productName =
                    await firstProduct.locator('h2').textContent();

                expect(productName).toBeTruthy();

                // Locate Add To Cart button
                const addToCartButton =
                    firstProduct.getByRole('button', {
                        name: /Add to cart/i
                    });

                // Add product to cart
                await addToCartButton.click();

                // Verify product successfully added
                await expect(addToCartButton)
                    .toHaveClass(/added/);

                // Navigate to shopping cart
                const cartLink = page.getByRole('link', {
                    name: /View Shopping Cart/i
                });

                await expect(cartLink).toBeVisible();

                await Promise.all([
                    page.waitForURL(/mycart/),
                    cartLink.click()
                ]);

                // Verify selected product exists in cart
                await expect(
                    page.getByText(productName!, {
                        exact: true
                    })
                ).toBeVisible();
            });


            // ======================================================
            // Step 5: Checkout and Place Order
            // ======================================================
            await test.step('Checkout and place order', async () => {

                // Proceed to checkout
                const checkoutButton = page.getByRole('link', {
                    name: /proceed to checkout/i
                });

                await expect(checkoutButton).toBeEnabled();

                await Promise.all([
                    page.waitForURL(/checkout/),
                    checkoutButton.click()
                ]);

                // Place order
                const placeOrderButton = page.getByRole('button', {
                    name: /place order/i
                });

                await expect(placeOrderButton).toBeEnabled();

                await Promise.all([
                    page.waitForURL(/order-received/),
                    placeOrderButton.click()
                ]);

                // Verify successful order confirmation
                await expect(
                    page.getByText('Thank you. Your order has')
                ).toBeVisible();

                // Capture generated order number
                orderId =
                    await page.getByRole('listitem')
                        .filter({
                            hasText: 'Order number:'
                        })
                        .locator('strong')
                        .textContent() || undefined;

                expect(
                    orderId,
                    'Order ID could not be read from the confirmation page'
                );

                console.log(orderId);
            });


            // ======================================================
            // Step 6: Verify Order History
            // ======================================================
            await test.step(
                'Verify order is available in order history',
                async () => {

                    console.log(orderId);

                    // Navigate to My Account
                    await page.getByRole('link', {
                        name: /my account/i
                    }).click();

                    // Open Orders page
                    await page.getByRole('link', {
                        name: 'Orders',
                        exact: true
                    }).click();

                    // Verify Orders table is displayed
                    const ordersTable =
                        page.getByRole('table');

                    await expect(ordersTable)
                        .toBeVisible();

                    // Locate row containing newly created order
                    const orderRow =
                        ordersTable
                            .getByRole('row')
                            .filter({
                                has: page.getByRole('link', {
                                    name: `View order number ${orderId}`
                                })
                            });

                    // Open order details
                    await orderRow
                        .getByRole('link', {
                            name: `View order ${orderId}`
                        })
                        .click();

                    // Verify correct order page opens
                    await expect(
                        page.getByRole('heading', {
                            name: `Order #${orderId}`
                        })
                    ).toBeVisible();
                }
            );


            // ======================================================
            // Step 7: Logout
            // ======================================================
            await test.step("Logout from application", async () => {

                // End user session
                await page.getByRole('link', {
                    name: 'Log out'
                }).click();
            });
        }
    );
});