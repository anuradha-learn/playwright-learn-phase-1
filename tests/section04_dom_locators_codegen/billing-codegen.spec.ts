import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://qa-cart.com/');
  await page.getByRole('textbox', { name: 'Username or email address' }).click();
  await page.getByRole('textbox', { name: 'Username or email address' }).fill('anuradha.learn@gmail.com');
  await page.getByRole('textbox', { name: 'Password  Required' }).click();
  await page.getByRole('textbox', { name: 'Password  Required' }).fill('Play@1234#$');
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page.getByLabel('Account pages').getByRole('link', { name: 'Log out' })).toBeVisible();
  await page.getByRole('link', { name: 'Address', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Billing address' })).toBeVisible();
  await page.getByRole('link', { name: 'Edit Billing address' }).click();
  await page.getByRole('textbox', { name: 'First name' }).click();
  await page.getByRole('textbox', { name: 'First name' }).fill('Anuradha1');
  await page.getByRole('textbox', { name: 'Last name' }).click();
  await page.getByRole('textbox', { name: 'Last name' }).fill('Agarwal1');
  await page.getByRole('textbox', { name: 'United Arab Emirates' }).click();
  await page.getByRole('option', { name: 'United Arab Emirates' }).click();
  await page.getByRole('textbox', { name: 'Street address' }).click();
  await page.getByRole('textbox', { name: 'Street address' }).fill('123 Test Street12345');
  await page.getByRole('button', { name: 'Save address' }).click();
  await page.goto('https://qa-cart.com/edit-address/');
  await expect(page.getByText('Address changed successfully.')).toBeVisible();
});