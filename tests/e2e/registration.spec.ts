import { test } from "@playwright/test"
import { v4 as uuidv4 } from "uuid"

import Dashboard from "../screens/dashboard"
import Login from "../screens/login"
import Registration from "../screens/registration"

test("should signup, verify email and login", async ({ page }) => {
  const email = `test-${uuidv4()}@test.com`
  const password = "test1234"

  const registration = new Registration(page)
  await registration.open()
  await registration.signup(email, password)
  await registration.verifyEmail(email)

  const login = new Login(page)
  await login.checkIsInLoginPage()
  await login.login(email, password)
})

test("reset password", async ({ page }) => {
  const email = `test-${uuidv4()}@test.com`
  const password = "test1234"
  const newPassword = "new-password"

  const registration = new Registration(page)
  await registration.open()
  await registration.signup(email, password)
  await registration.verifyEmail(email)

  const login = new Login(page)
  await login.checkIsInLoginPage()
  await login.login(email, password)

  const dashboard = new Dashboard(page)
  await dashboard.logout()

  await login.forgotPassword(email, newPassword)
  await login.login(email, newPassword)
})
