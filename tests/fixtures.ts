import { test as baseTest } from "@playwright/test"

import { baseURL } from "../playwright.config"
import { createUser } from "./mock/user"

const fs = require("fs")
const path = require("path")

export * from "@playwright/test"
export const test = baseTest.extend<{}, { workerStorageState: string }>({
  // Use the same storage state for all tests in this worker.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  storageState: ({ workerStorageState }, use) => use(workerStorageState),

  // Authenticate once per worker with a worker-scoped fixture.
  workerStorageState: [
    async ({ browser }, use) => {
      // Use parallelIndex as a unique identifier for each worker.
      const id = test.info().parallelIndex

      const fileName = path.resolve(
        test.info().project.outputDir,
        `.auth/${id}.json`
      )

      if (fs.existsSync(fileName)) {
        // Reuse existing authentication state if any.
        await use(fileName)
        return
      }

      // Important: make sure we authenticate in a clean environment by unsetting storage state.
      const page = await browser.newPage({ storageState: undefined })

      // Acquire a unique account, for example create a new one.
      // Alternatively, you can have a list of precreated accounts for testing.
      // Make sure that accounts are unique, so that multiple team members
      // can run tests at the same time without interference.
      const account = await createUser(`${id}`, true)

      // Perform authentication steps. Replace these actions with your own.
      await page.goto(`${baseURL}/en/login`)
      await page.getByTestId("email").fill(account.email)
      await page.getByTestId("password").fill(account.password)
      await page.getByTestId("login-button").click()

      // Wait until the page receives the cookies.
      //
      // Sometimes login flow sets cookies in the process of several redirects.
      // Wait for the final URL to ensure that the cookies are actually set.
      await page.waitForURL(`${baseURL}/en/dashboard`, {
        timeout: 10000,
        waitUntil: "networkidle",
      })

      // End of authentication steps.
      await page.context().storageState({ path: fileName })
      await page.close()
      await use(fileName)
    },
    { scope: "worker" },
  ],
})
