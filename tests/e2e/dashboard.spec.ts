import { test } from "../fixtures"

test("should open dashboard", async ({ page, baseURL }) => {
  if (!baseURL) {
    throw "baseURL is undefined"
  }

  await page.goto(`${baseURL}/en`)
  await page.waitForURL(`${baseURL}/en/dashboard`, {
    timeout: 5000,
    waitUntil: "networkidle",
  })
})
