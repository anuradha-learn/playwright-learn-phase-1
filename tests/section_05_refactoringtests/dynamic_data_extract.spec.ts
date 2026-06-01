import { test, expect } from '@playwright/test';
let orderId:string | undefined
const loginData=
{
    baseUrl:"https://qa-cart.com/",
    username:"anuradha.learn@gmail.com",
    password:"Play@1234#$"
  
}
const testData={
  
   search:{
    keyword:        'organic',
    maxPrice:       '$25',
    expectedResult: 'Organic Face Scrub'
  },

  product: {
    name:  'Pulses From Organic Farm',
    price: '$15.00',
  },
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
    }
    )
    await test.step("Search for organic products", async () => {
      await page.getByRole('searchbox', { name: 'Search' }).fill(testData.search.keyword);
      await page.getByRole('button', { name: 'Search' }).click();
      // await expect(page.getByRole('heading', { name: 'Search results: “organic”' })).toBeVisible();
      // await expect(page.getByRole('heading', { name: 'Search results: '+'“'+testData.search.keyword +'”' })).toBeVisible();
      await expect(page.getByRole('heading', { name: `Search results: “${testData.search.keyword}”` })).toBeVisible();

      await expect(page.locator('a').filter({ hasText: testData.search.expectedResult})).toBeVisible();

    }
    )
    await test.step('Apply maximum price filter', async () => {
      await page.getByRole('textbox', { name: 'Filter products by maximum' }).fill(testData.search.maxPrice);
      await expect(page.getByText(testData.product.price)).toBeVisible();
    }
    )
    await test.step('Add filtered product to cart', async () => {
      await page.getByRole('button', { name: `Add to cart: “${testData.product.name}` }).click();
      await expect(page.getByRole('button', { name: `Add to cart: “${testData.product.name}` })).toBeVisible();
      await expect(page.getByRole('link', { name: 'View Shopping Cart, 1 items' })).toBeVisible();
      await page.getByRole('link', { name: 'View Shopping Cart, 1 items' }).click();
      await expect(page.getByText(testData.product.name, { exact: true })).toBeVisible();
    }
    )
    await test.step('Checkout and place order', async () => {
      await page.getByRole('link', { name: 'Proceed to checkout' }).click();
      await page.getByRole('button', { name: 'Place order' }).click();
      await expect(page.getByText('Thank you. Your order has')).toBeVisible();
      //retrieve order id
      orderId= await page.getByRole('listitem').filter({hasText:'Order number:'})
      .locator('strong').textContent() || undefined
      expect(orderId,'Order ID could not be read from the confirmation page')
      console.log(orderId)
      
    }
    )
    //await page.pause()

    await test.step('Verify order is available in order history', async () => {
      console.log(orderId)
      await page.getByRole('link', { name: 'My account' }).click();
      await page.getByRole('link', { name: 'Orders', exact: true }).click();
      const ordersTable=page.getByRole('table')
      const orderRow=ordersTable.getByRole('row').
      filter({has:page.getByRole('link',{name:`View order number ${orderId}`})})
      await orderRow.getByRole('link', { name: `View order ${orderId}` }).click()
      await expect(page.getByRole('heading', { name: `Order #${orderId}` })).toBeVisible();
      await page.pause()
      // await expect(page.getByRole('link', { name: 'View order number 5717' })).toBeVisible();
      // await page.getByRole('link', { name: 'View order 5717' }).click();
      // await expect(page.getByRole('heading', { name: 'Order #' })).toBeVisible();
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