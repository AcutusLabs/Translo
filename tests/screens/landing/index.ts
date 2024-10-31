import { expect, Page } from "@playwright/test"

import { baseURL } from "../../../playwright.config"

export default class Landing {
  page: Page

  constructor(page: Page) {
    this.page = page
  }

  async checkIsInLoginPage() {
    await expect(this.page).toHaveURL(new RegExp(".*en/login(?!/)"))
  }

  async checkIsInLandingPage() {
    await this.page.waitForURL(`${baseURL}/en`, {
      timeout: 5000,
      waitUntil: "networkidle",
    })
  }

  async open() {
    await this.page.goto(`${baseURL}/en`)
    await this.checkIsInLandingPage()
  }

  async changeLanguage(language: string) {
    await this.page.getByTestId("language-selector").click()
    await this.page.getByTestId(`language-selector-${language}`).click()
    await this.page.waitForURL(`${baseURL}/${language}`, {
      timeout: 5000,
      waitUntil: "networkidle",
    })
  }
}
