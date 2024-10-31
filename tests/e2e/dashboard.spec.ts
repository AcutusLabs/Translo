import { test } from "../fixtures"
import Dashboard from "../screens/dashboard"

test("should open dashboard", async ({ page, baseURL }) => {
  if (!baseURL) {
    throw "baseURL is undefined"
  }

  const dashboard = new Dashboard(page)
  await dashboard.open()
})

test("try to open pages when logged in", async ({ page, baseURL }) => {
  if (!baseURL) {
    throw "baseURL is undefined"
  }

  const dashboard = new Dashboard(page)
  await dashboard.open()

  await page.goto(`${baseURL}/en/login`)
  await dashboard.checkIsInDashboard()
  await page.goto(`${baseURL}/en/register`)
  await dashboard.checkIsInDashboard()
  await page.goto(`${baseURL}/en`)
  await dashboard.checkIsInDashboard()
  await page.goto(`${baseURL}/en/pricing`)
  await page.waitForURL(`${baseURL}/en/pricing`, {
    timeout: 5000,
    waitUntil: "networkidle",
  })
})
