import { test, expect } from '@playwright/test'
import { goto, login, reload, tokenTimeout } from './utils'

test('should be logged in', async ({ browser }) => {
  const context = await browser.newContext()
  const page = await context.newPage()
  await login(page)

  await reload(page)
  await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible()

  await goto(page, '/')
  await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible()

  await page.goto('/404')
  await expect(page.getByRole('heading', { name: '404' })).toBeVisible()
  await page.getByRole('link', { name: 'Go back home' }).click()
  await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible()
})

test('should refresh session', async ({ browser }) => {
  const context = await browser.newContext()
  const page = await context.newPage()
  await login(page)

  await expect(page.getByTestId('user-data')).toContainText('id')

  await page.waitForTimeout(tokenTimeout)
  await page.getByRole('button', { name: 'Fetch user' }).click()
  await page.waitForTimeout(2000)
  await expect(page.getByTestId('user-data')).toContainText('id')
})
