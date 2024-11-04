import { Page } from "@playwright/test"

import { baseURL } from "../../../playwright.config"
import { checkPage, openPage } from "../../utils"

export default class Dashboard {
  page: Page

  constructor(page: Page) {
    this.page = page
  }

  async checkIsInDashboard() {
    await checkPage(this.page, `${baseURL}/en/dashboard`)
  }

  async checkIsInLoginPage() {
    await checkPage(this.page, `${baseURL}/en/login`)
  }

  async open() {
    await openPage(this.page, `${baseURL}/en`)
    await this.checkIsInDashboard()
  }

  async logout() {
    await this.page.getByTestId("user-account-nav-trigger").click()
    await this.page.getByTestId("logout-button").click()
    await this.checkIsInLoginPage()
  }
}
