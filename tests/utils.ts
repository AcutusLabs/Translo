import {
  Page,
  PlaywrightTestArgs,
  PlaywrightTestOptions,
  PlaywrightWorkerArgs,
  PlaywrightWorkerOptions,
  TestType,
} from "@playwright/test"

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

type SetupTestParams = {
  test: TestType<
    PlaywrightTestArgs & PlaywrightTestOptions,
    PlaywrightWorkerArgs & PlaywrightWorkerOptions
  >
  cookies: any[]
  projectIds?: string[]
  shouldCreateProject?: boolean
  shouldSkipTest?: boolean
}
export const setupTest = (params: SetupTestParams) => {
  const { test, shouldSkipTest } = params

  if (shouldSkipTest) {
    test.skip()
  }
}

export const produceHttpCall = async (
  page: Page,
  runner: Promise<any>,
  afterSleep = 500
) => {
  await runner
  await sleep(500)
  await Promise.race([page.waitForLoadState("networkidle"), sleep(5000)])
  await sleep(afterSleep)
}
