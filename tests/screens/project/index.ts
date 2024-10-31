import { expect, Page } from "@playwright/test"

import { baseURL } from "../../../playwright.config"
import Dashboard from "../dashboard"

export default class Project {
  page: Page

  constructor(page: Page) {
    this.page = page
  }

  async checkIsInProjectPage() {
    await this.page.waitForURL(`${baseURL}/en/projects/**`, {
      timeout: 5000,
      waitUntil: "networkidle",
    })
  }

  async closeDetailSlideOver() {
    await this.page.getByTestId("slide-over-close-button").click()
  }

  async editKeywordWork(work: () => Promise<void>) {
    await expect(this.page.getByTestId("slide-over")).toBeVisible()
    await work()
    await this.page.getByTestId("save-translations-button").click()
    await expect(
      this.page.getByTestId("save-translations-button").getByText("Saved")
    ).toBeVisible()
    await this.closeDetailSlideOver()
    await expect(this.page.getByTestId("slide-over")).not.toBeVisible()
  }

  async openDashboard() {
    const dashboard = new Dashboard(this.page)
    await dashboard.open()
  }

  async createProject(name: string) {
    await this.openDashboard()
    await this.page.getByTestId("add-new-project-button").first().click()
    await this.page.getByTestId("add-new-project-input").fill(name)
    await this.page.getByTestId("add-new-project-create-button").click()
    await this.checkIsInProjectPage()
  }

  async addNewLanguage() {
    await this.createProject("Test project")
    await this.page
      .getByTestId("add-new-language-modal-trigger")
      .first()
      .click()
    await this.page.getByTestId("language-selector-trigger").click()
    await this.page.getByText("Afrikaans").click()
    await this.page.getByTestId("add-new-language-button").click()
    await this.page.getByTestId("settings-button").click()
    await this.page.isVisible("text='Afrikaans'")
    await this.closeDetailSlideOver()
  }

  async addNewKeyword(key: string, multilanguage: boolean) {
    if (multilanguage) {
      await this.addNewLanguage()
    } else {
      await this.createProject("Test project")
    }
    await this.page.getByTestId("add-new-keyword-modal-trigger").click()
    await this.page.getByTestId("add-new-keyword-input").fill(key)
    await this.page.getByTestId("add-new-keyword-button").click()
    await expect(this.page.getByTestId(`keyword-cell-${key}`)).toBeVisible()
  }

  async deleteKeyword(key: string) {
    await this.addNewKeyword(key, false)
    await this.page.getByTestId(`delete-keyword-trigger-${key}`).click()
    await this.page.getByTestId("delete-keyword-button").click()
    await expect(this.page.getByTestId(`keyword-cell-${key}`)).toBeVisible({
      visible: false,
    })
  }

  async editKeyword(key: string) {
    await this.addNewKeyword(key, true)
    await this.page.getByTestId(`delete-keyword-trigger-${key}`).click()
    await this.page.getByTestId("edit-keyword-button").click()

    await this.editKeywordWork(async () => {
      await this.page
        .getByTestId("context-textarea-English")
        .fill("original value")
      await this.page
        .getByTestId("context-textarea-Afrikaans")
        .fill("translated value")
    })
  }

  async saveTranslation(key: string) {
    await this.addNewKeyword(key, true)
    await this.page.getByTestId(`keyword-cell-${key}`).click()

    await this.editKeywordWork(async () => {
      await this.page
        .getByTestId("context-textarea-English")
        .fill("original value")
      await this.page
        .getByTestId("context-textarea-Afrikaans")
        .fill("translated value")
    })
  }
}
