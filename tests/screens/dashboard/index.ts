import { Page } from "@playwright/test"

import { baseURL } from "../../../playwright.config"

export default class Dashboard {
  page: Page

  constructor(page: Page) {
    this.page = page
  }

  async open() {
    await this.page.goto(`${baseURL}/en`)
    await this.page.waitForURL(`${baseURL}/en/dashboard`, {
      timeout: 5000,
      waitUntil: "networkidle",
    })
  }
}