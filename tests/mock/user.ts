import { v4 as uuidv4 } from "uuid"

import { httpCall } from "../httpTest"

export const createUser = async (
  random: string,
  isSubscribed: boolean
): Promise<{ email: string; password: string }> => {
  const email = `test-${random}-${uuidv4()}@transloe2etest.com`
  const password = "testtest"

  const registration = JSON.stringify({
    name: "Test",
    email,
    password,
    password_confirmation: password,
    google_recaptcha_token: "aaaa",
    skip_activation: true,
    add_fake_subscription: isSubscribed,
  })

  try {
    await httpCall({ method: "POST", url: "/users", data: registration })
  } catch (e) {
    throw e
  }

  return { email, password }
}
