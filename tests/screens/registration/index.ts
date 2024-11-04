import { expect, Page } from "@playwright/test"

import { baseURL } from "../../../playwright.config"
import { checkPage, openPage } from "../../utils"

export default class Registration {
  page: Page

  constructor(page: Page) {
    this.page = page
  }

  async checkIsInRegistrationPage() {
    await checkPage(this.page, `${baseURL}/en/register`)
  }

  async open() {
    await openPage(this.page, `${baseURL}/en/register`)
    await this.checkIsInRegistrationPage()
  }

  async signup(email: string, password: string) {
    await this.page.getByTestId("email").fill(email)
    await this.page.getByTestId("password").fill(password)
    await this.page.getByTestId("register-button").click()
    await expect(this.page.getByTestId("register-toast-success")).toBeVisible()
  }

  async verifyEmail(email: string) {
    await openPage(
      this.page,
      `${baseURL}/en/email-verify?email=${email}&token=test-token`
    )
  }
}
