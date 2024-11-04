import { Page } from "@playwright/test"

import { baseURL } from "../../../playwright.config"
import { checkPage, openPage } from "../../utils"

export default class Landing {
  page: Page

  constructor(page: Page) {
    this.page = page
  }

  async checkIsInLoginPage() {
    await checkPage(this.page, new RegExp(".*en/login(?!/)"))
  }

  async checkIsInLandingPage() {
    await checkPage(this.page, `${baseURL}/en`)
  }

  async open() {
    await openPage(this.page, `${baseURL}/en`)
    await this.checkIsInLandingPage()
  }

  async changeLanguage(language: string) {
    await this.page.waitForTimeout(1000) // wait for the preline setup
    await this.page.getByTestId("language-selector").click()
    await this.page.getByTestId(`language-selector-${language}`).click()
    await checkPage(this.page, `${baseURL}/${language}`)
  }
}
