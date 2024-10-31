import { test } from "../fixtures"
import Dashboard from "../screens/dashboard"

test("should open dashboard", async ({ page, baseURL }) => {
  if (!baseURL) {
    throw "baseURL is undefined"
  }

  const dashboard = new Dashboard(page)
  await dashboard.open()
})
