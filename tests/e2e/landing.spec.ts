import { test } from "@playwright/test"

import { baseURL } from "../../playwright.config"
import Landing from "../screens/landing"
import { openPage } from "../utils"

const { languagesSupported } = require("../../lib/i18n")

test("should change language", async ({ page }) => {
  const landing = new Landing(page)
  await landing.open()

  for (const language of languagesSupported.filter((l) => l !== "en")) {
    await landing.changeLanguage(language)
  }
})

test("try to open app without being logged in", async ({ page }) => {
  const landing = new Landing(page)
  await landing.open()

  await openPage(page, `${baseURL}/en/dashboard`)
  await landing.checkIsInLoginPage()
  await openPage(page, `${baseURL}/en/dashboard/settings`)
  await landing.checkIsInLoginPage()
  await openPage(page, `${baseURL}/en/dashboard/billing`)
  await landing.checkIsInLoginPage()
  await openPage(page, `${baseURL}/en/projects`)
  await landing.checkIsInLoginPage()
})
