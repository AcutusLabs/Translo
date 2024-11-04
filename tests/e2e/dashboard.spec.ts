import { baseURL } from "../../playwright.config"
import { test } from "../fixtures"
import Dashboard from "../screens/dashboard"
import { checkPage, openPage } from "../utils"

test("should open dashboard", async ({ page }) => {
  const dashboard = new Dashboard(page)
  await dashboard.open()
})

test("try to open pages when logged in", async ({ page }) => {
  const dashboard = new Dashboard(page)
  await dashboard.open()

  await openPage(page, `${baseURL}/en/login`)
  await dashboard.checkIsInDashboard()
  await openPage(page, `${baseURL}/en/register`)
  await dashboard.checkIsInDashboard()
  await openPage(page, `${baseURL}/en`)
  await dashboard.checkIsInDashboard()
  await openPage(page, `${baseURL}/en/pricing`)
  await checkPage(page, `${baseURL}/en/pricing`)
})
