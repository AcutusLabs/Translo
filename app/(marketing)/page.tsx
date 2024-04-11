import { redirect } from "next/navigation"

import { PageAnalytics } from "@/lib/analytics-client"
import i18n from "@/lib/i18n"
import { getCurrentUser } from "@/lib/session"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import Faq from "@/components/app/homepage/faq"
import Features from "@/components/app/homepage/features"
import GetStarterd from "@/components/app/homepage/get-started"
import { Icons } from "@/components/icons"
import PostHogAnalytics from "@/components/posthog"

export default async function IndexPage() {
  const user = await getCurrentUser()

  if (user) {
    redirect("/dashboard")
  }

  const Analytics = await PostHogAnalytics(PageAnalytics.home)

  return (
    <>
      {Analytics}
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1
            className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl"
            dangerouslySetInnerHTML={{
              __html: i18n
                .t("Get your app speaking every language with our localization")
                .replace(/(< *script)/gi, "illegalscript"),
            }}
          ></h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            {i18n.t(
              "With Translo, centralize your app's translation and help yourself using AI to ensure that your app easily reaches a global audience"
            )}
          </p>
          <div className="space-x-4">
            <GetStarterd />
          </div>
        </div>
      </section>
      <section id="features">
        <Features />
      </section>
      <section>
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-8">
          <div className="max-w-3xl text-center mx-auto">
            <h2 className="block font-heading text-4xl sm:text-5xl md:text-6xl lg:text-5xl">
              {i18n.t("Do you need any specific features?")}
            </h2>
          </div>
          <div className="mt-5 max-w-3xl text-center mx-auto">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {i18n.t(
                "Contribute to the GitHub project; once we approve it, all clients will have it available."
              )}
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {i18n.t(
                "We strongly believe in open-source contributions and aim to deliver the best service for our customers."
              )}
            </p>
          </div>
          <div className="text-center">
            <a
              // className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-white disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1"
              href="https://github.com/Matergi/Translo"
              className={cn(buttonVariants())}
            >
              <Icons.gitHub />
              {i18n.t("Open github")}
            </a>
          </div>
        </div>
      </section>
      <section>
        <Faq />
      </section>
      <section>
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-8">
          <div className="max-w-3xl text-center mx-auto">
            <h2
              className="block font-heading text-4xl sm:text-5xl md:text-6xl lg:text-5xl"
              dangerouslySetInnerHTML={{
                __html: i18n
                  .t(
                    "Unlock a global audience, unleashing your business growth. Translo is your key"
                  )
                  .replace(/(< *script)/gi, "illegalscript"),
              }}
            ></h2>
          </div>

          <GetStarterd />
        </div>
      </section>
    </>
  )
}
