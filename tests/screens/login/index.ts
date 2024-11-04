import { expect, Page } from "@playwright/test"

import { baseURL } from "../../../playwright.config"
import { checkPage, openPage } from "../../utils"
import Dashboard from "../dashboard"

export default class Login {
  page: Page

  constructor(page: Page) {
    this.page = page
  }

  async checkIsInLoginPage() {
    await checkPage(this.page, `${baseURL}/en/login`)
  }

  async open() {
    await openPage(this.page, `${baseURL}/en/login`)
    await this.checkIsInLoginPage()
  }

  async login(email: string, password: string) {
    await this.page.getByTestId("email").fill(email)
    await this.page.getByTestId("password").fill(password)
    await this.page.getByTestId("login-button").click()
    const dashboard = new Dashboard(this.page)
    await dashboard.checkIsInDashboard()
  }

  async forgotPassword(email: string, newPassword: string) {
    await this.page.getByTestId("forgot-password-trigger").click()
    await this.page.getByTestId("email-forgot-password").fill(email)
    await this.page.getByTestId("reset-password-button").click()
    await expect(
      this.page.getByTestId("forgot-password-toast-success")
    ).toBeVisible()
    await openPage(
      this.page,
      `${baseURL}/en/reset-password?email=${email}&token=test-token`
    )
    await this.page.getByTestId("new-password").fill(newPassword)
    await this.page.getByTestId("change-password-button").click()
    await this.checkIsInLoginPage()
  }
}
