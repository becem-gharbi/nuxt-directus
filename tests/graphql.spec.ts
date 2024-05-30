import { test, expect } from '@playwright/test'
import { goto, login, readCounter } from './utils'

test('should query data', async ({ browser }) => {
  const context = await browser.newContext()
  const page = await context.newPage()
  await login(page)

  await goto(page, '/graphql')
  await expect(page.getByRole('heading', { name: 'GraphQL' })).toBeVisible()

  await readCounter(page)

  await context.close()
})

test('should mutate and subscribe', async ({ browser }) => {
  const context = await browser.newContext()
  const page = await context.newPage()
  await login(page)

  await goto(page, '/graphql')
  await expect(page.getByRole('heading', { name: 'GraphQL' })).toBeVisible()

  const initialValue = await readCounter(page)

  await page.getByRole('button', { name: 'Increment' }).click()
  await page.waitForTimeout(2000)

  if (process.env.NUXT_PUBLIC_DIRECTUS_AUTH_MODE === 'session') {
    await page.getByRole('button', { name: 'Refresh' }).click()
    await page.waitForTimeout(2000)
  }

  const updatedValue = await readCounter(page)

  expect(updatedValue).toBeGreaterThanOrEqual(initialValue)

  await context.close()
})
