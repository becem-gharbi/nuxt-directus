import { test, expect } from '@playwright/test'
import { login, goto } from './utils'

test('should read items', async ({ browser }) => {
  const context = await browser.newContext()
  const page = await context.newPage()
  await login(page)

  await goto(page, '/rest')
  await expect(page.getByRole('heading', { name: 'Rest' })).toBeVisible()

  await expect(page.getByTestId('rest-data')).toContainText('id')

  await context.close()
})
