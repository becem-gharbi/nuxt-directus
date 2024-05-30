import { type Page, expect } from '@playwright/test'

export const credentials = { email: 'test@test.com', password: 'abc123' }

export const tokenTimeout = 14000

export async function goto(page: Page, path: string) {
  await page.goto(path)
  await expect(page.getByTestId('hydration-check')).toBeDefined()
}

export async function reload(page: Page) {
  await page.reload()
  expect(page.getByTestId('hydration-check')).toBeDefined()
}

export async function login(page: Page) {
  await goto(page, '/auth/login')
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
  await page.getByPlaceholder('email').fill(credentials.email)
  await page.getByPlaceholder('password').fill(credentials.password)
  await page.getByRole('button', { name: 'Login', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible()
}

export async function readCounter(page: Page) {
  const counter = await page.getByTestId('counter').textContent()
  expect(counter).not.toBeNaN()
  return Number.parseInt(counter as string)
}
