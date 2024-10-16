import { Metadata } from "next"
import Link from "next/link"

import { env } from "@/env.mjs"
import { PageAnalytics } from "@/lib/analytics-client"
import i18n from "@/lib/i18n"
import { withI18n } from "@/lib/i18n/with-i18n"
import { navigate } from "@/lib/link"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { UserAuthForm } from "@/components/app/login/user-auth-form"
import { Icons } from "@/components/icons"
import PageView from "@/components/posthog/page-view"

export const metadata: Metadata = {
  metadataBase: new URL(`${env.NEXT_PUBLIC_APP_URL}/login`),
  title: "Login",
  description: "Login to your account",
}

export default withI18n(function LoginPage() {
  return (
    <>
      <PageView page={PageAnalytics.login} />
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <Link
          href={navigate().home()}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute left-4 top-4 md:left-8 md:top-8"
          )}
        >
          <>
            <Icons.chevronLeft className="mr-2 h-4 w-4" />
            {i18n.t("Back")}
          </>
        </Link>
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <Icons.logo className="mx-auto h-6 w-6" />
            <h1 className="text-2xl font-semibold tracking-tight">
              {i18n.t("Welcome back")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {i18n.t("Enter your email to sign in to your account")}
            </p>
          </div>
          <UserAuthForm type="login" />
          <p className="px-8 text-center text-sm text-muted-foreground">
            <Link
              href={navigate().register()}
              className="hover:text-brand underline underline-offset-4"
            >
              {i18n.t("Dont have an account? Sign Up")}
            </Link>
          </p>
        </div>
      </div>
    </>
  )
})
