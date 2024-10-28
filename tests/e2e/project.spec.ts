import { test } from "../fixtures"
import Project from "../screens/project"

test("should create project", async ({ page, baseURL }) => {
  if (!baseURL) {
    throw "baseURL is undefined"
  }

  const project = new Project(page)
  await project.createProject("Test project")
})

test("should add new language", async ({ page, baseURL }) => {
  if (!baseURL) {
    throw "baseURL is undefined"
  }

  const project = new Project(page)
  await project.addNewLanguage()
})

test("should add new keyword", async ({ page, baseURL }) => {
  if (!baseURL) {
    throw "baseURL is undefined"
  }

  const project = new Project(page)
  await project.addNewKeyword("Test keyword", true)
})

test("should delete keyword", async ({ page, baseURL }) => {
  if (!baseURL) {
    throw "baseURL is undefined"
  }

  const project = new Project(page)
  await project.deleteKeyword("Test keyword")
})

test("should save translation", async ({ page, baseURL }) => {
  if (!baseURL) {
    throw "baseURL is undefined"
  }

  const project = new Project(page)
  await project.saveTranslation("Test keyword")
})

test("should edit keyword", async ({ page, baseURL }) => {
  if (!baseURL) {
    throw "baseURL is undefined"
  }

  const project = new Project(page)
  await project.editKeyword("Test keyword")
})
