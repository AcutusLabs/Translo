import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/session"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import Faq from "@/components/app/homepage/faq"
import Features from "@/components/app/homepage/features"
import GetStarterd from "@/components/app/homepage/get-started"
import { Icons } from "@/components/icons"

export default async function IndexPage() {
  const user = await getCurrentUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <>
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Get your app speaking{" "}
            <span className="text-blue-600">every language</span> with our
            localization
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            With Translo, centralize your app&apos;s translation and help
            yourself using AI to ensure that your app easily reaches a global
            audience
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
            <h1 className="block font-heading text-4xl sm:text-5xl md:text-6xl lg:text-5xl">
              Do you need any specific features?
            </h1>
          </div>
          <div className="mt-5 max-w-3xl text-center mx-auto">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Contribute to the GitHub project; once we approve it, all clients
              will have it available.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              We strongly believe in open-source contributions and aim to
              deliver the best service for our customers.
            </p>
          </div>
          <div className="text-center">
            <a
              // className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-white disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1"
              href="https://github.com/Matergi/Translo"
              className={cn(buttonVariants())}
            >
              <Icons.gitHub />
              Open github
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
            <h1 className="block font-heading text-4xl sm:text-5xl md:text-6xl lg:text-5xl">
              Unlock a global audience, unleashing your business growth.{" "}
              <span className="text-blue-600">Translo is your key</span>
            </h1>
          </div>

          <GetStarterd />
        </div>
      </section>
    </>
  )
}
