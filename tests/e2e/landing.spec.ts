import { test } from "@playwright/test"

import Landing from "../screens/landing"

const { languagesSupported } = require("../../lib/i18n")

test("should change language", async ({ page, baseURL }) => {
  if (!baseURL) {
    throw "baseURL is undefined"
  }

  const landing = new Landing(page)
  await landing.open()

  for (const language of languagesSupported.filter((l) => l !== "en")) {
    await landing.changeLanguage(language)
  }
})

test("try to open app without being logged in", async ({ page, baseURL }) => {
  if (!baseURL) {
    throw "baseURL is undefined"
  }

  const landing = new Landing(page)
  await landing.open()

  await page.goto(`${baseURL}/en/dashboard`)
  await landing.checkIsInLoginPage()
  await page.goto(`${baseURL}/en/dashboard/settings`)
  await landing.checkIsInLoginPage()
  await page.goto(`${baseURL}/en/dashboard/billing`)
  await landing.checkIsInLoginPage()
  await page.goto(`${baseURL}/en/projects`)
  await landing.checkIsInLoginPage()
})
