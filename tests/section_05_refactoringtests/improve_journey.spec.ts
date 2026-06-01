import { test, expect } from '@playwright/test';
let orderId: string | undefined
const loginData =
{
  baseUrl: "https://qa-cart.com/",
  username: "anuradha.learn@gmail.com",
  password: "Play@1234#$"

}
const testData = {

  search: {
    keyword: 'organic',
    maxPrice: '$25',
    expectedResult: 'Organic Face Scrub'
  },

  // product: {
  //   name:  'Pulses From Organic Farm',
  //   // price: '$15.00',
  // },
}
test.beforeEach(async ({ page }) => {
  await page.goto(loginData.baseUrl);
  await page.getByRole('textbox', { name: 'Username or email address' }).fill(loginData.username);
  await page.getByRole('textbox', { name: 'Password  Required' }).fill(loginData.password);
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page.getByLabel('Account pages').getByRole('link', { name: 'Log out' })).toBeVisible()
})
test.describe("Demoshop purchase product @product_purchase", async () => {

  test('registered user can search, filter, purchase product, and verify order @smoke @regression @checkout', async ({ page }) => {


    // await test.step('Login as registered user', async () => {
    //   await page.getByRole('textbox', { name: 'Username or email address' }).fill('anuradha.learn@gmail.com');
    //   await page.getByRole('textbox', { name: 'Password  Required' }).fill('Play@1234#$');
    //   await page.getByRole('button', { name: 'Log in' }).click();
    //   await expect(page.getByLabel('Account pages').getByRole('link', { name: 'Log out' })).toBeVisible()
    // })

    await test.step('Open DemoShop page', async () => {
      await page.getByRole('link', { name: 'DemoShop' }).click();
      await expect(page.getByRole('heading', { name: 'DemoShop' })).toBeVisible();
      const products = page.locator("ul.products li")
      await products.first().waitFor({ state: 'visible' })
    }
    )
    await test.step("Search for  products", async () => {
      await page.getByRole('searchbox', { name: 'Search' }).fill(testData.search.keyword);
      await page.getByRole('button', { name: 'Search' }).click();
      await expect(page.getByRole('heading', { name: `Search results: “${testData.search.keyword}”` })).toBeVisible();

      // await expect(page.locator('a').filter({ hasText: testData.search.expectedResult})).toBeVisible();
      const products = page.locator("ul.products li")
      await products.first().waitFor({ state: 'visible' })
      const count = await products.count()
      for (let i = 0; i < count; i++) {
        const product = products.nth(i)
        const title = await product.getByRole('heading').textContent()
        expect(title?.toLowerCase()).toContain(testData.search.keyword.toLowerCase())
      }

    }
    )
    await test.step('Apply maximum price filter', async () => {
      await page.getByRole('textbox', { name: 'Filter products by maximum' }).fill(testData.search.maxPrice);
      // await expect(page.getByText(testData.product.price)).toBeVisible();
      const maxPriceNum = Number(testData.search.maxPrice.replace('$', ''))
      await page.getByText(`Up to $${maxPriceNum}`).waitFor({ state: 'visible' })
      const products = page.locator("ul.products li")
      await products.first().waitFor({ state: 'visible' })
      const count = await products.count()
      for (let i = 0; i < count; i++) {
        const product = products.nth(i)
        // const title= await product.getByRole('heading').textContent()
        const priceText = await product.locator('.price').textContent()
        const price = Number(priceText?.replace(/[^0-9.]/g, ""))
        expect(price).toBeLessThanOrEqual(maxPriceNum)
      }

    }
    )
    await test.step('Add product to cart', async () => {
      const products = page.locator("ul.products li")
      await products.first().waitFor({ state: 'visible' })
      const firstProduct = products.first()
      const productName = await firstProduct.getByRole('heading').textContent()
      expect(productName).toBeTruthy()
      const addToCartButton = firstProduct.getByRole('button', { name: /Add to cart/i })
      addToCartButton.click()
      await expect(addToCartButton).toHaveClass(/added/)
      const cartLink = page.getByRole('link', { name: /View Shopping Cart/i })
      await expect(cartLink).toBeVisible()
      await Promise.all([page.waitForURL(/mycart/),
      cartLink.click()
      ])

      // await cartLink.click()
      // await page.waitForURL(/mycart/)
      await page.waitForLoadState("domcontentloaded")

      await expect(page.getByText(productName!, { exact: true })).toBeVisible()

    }
    )
    await test.step('Checkout and place order', async () => {

      const checkoutButton = page.getByRole('link', { name: /proceed to checkout/i })
      await expect(checkoutButton).toBeEnabled()
      await Promise.all([
        page.waitForURL(/checkout/),
        await checkoutButton.click()])

      const placeOrderButton = page.getByRole('button', { name: /place order/i })
      await expect(placeOrderButton).toBeEnabled()
      await Promise.all([
        page.waitForURL(/order-received/),
        await placeOrderButton.click()])

      await page.waitForLoadState('domcontentloaded')
      await expect(page.getByText('Thank you. Your order has')).toBeVisible();

      //retrieve order id
      orderId = await page.getByRole('listitem').filter({ hasText: 'Order number:' })
        .locator('strong').textContent() || undefined

      expect(orderId, 'Order ID could not be read from the confirmation page')

      console.log(orderId)


    }
    )


    await test.step('Verify order is available in order history', async () => {
      const myaccountLink = page.getByRole('link', { name: /my account/i })
      await Promise.all([
        page.waitForURL(/qa-cart.com/),
        await myaccountLink.click()])
      const ordersLink = page.getByRole('link', { name: 'Orders', exact: true })
      await Promise.all([
        page.waitForURL(/orders/),
        await ordersLink.click()])
      await page.waitForLoadState('domcontentloaded')
      
      const ordersTable = page.getByRole('table')
      expect(ordersTable).toBeVisible()

      const orderRow = ordersTable.getByRole('row').
        filter({ has: page.getByRole('link', { name: `View order number ${orderId}` }) })
      const viewOrderLink=orderRow.getByRole('link', { name: `View order ${orderId}` })

      await expect(viewOrderLink).toBeVisible()

      await Promise.all([
      page.waitForURL(/view-order/),
      await orderRow.getByRole('link', { name: `View order ${orderId}` }).click()])
      await page.waitForLoadState('domcontentloaded')

      await expect(page.getByRole('heading', { name: `Order #${orderId}` })).toBeVisible();
      

    }
    )
    await test.step("Logout from application", async () => {
      await page.getByRole('link', { name: 'Log out' }).click();
    }
    )
  }
  )

  // test("search product @regression", async ({page}) => {
  //   console.log("verify search product")
  // })

  // test("filter by price product @regression", async ({page}) => {
  //   console.log("verify filter by price product")
  // })

  // test("verify checkout @regression @checkout", async () => {
  //   console.log("verify filter by checkoutt")
  // })
  // test.skip("guest user can complete checkout @checkout", async () => {
  //   // Guest checkout is disabled in the current environment
  // });

  //   test.fixme('order confirmation email shows correct total @checkout', async ({ page }) => {
  //   // Known issue: email service is down in staging
  //   // Unblock after JIRA-4421
  // });

}
)
  ;