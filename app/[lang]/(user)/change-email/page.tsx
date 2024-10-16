"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"

import { PageAnalytics } from "@/lib/analytics-client"
import { HTTP_POST, HTTP_POST_PATH } from "@/lib/api"
import i18n from "@/lib/i18n"
import { withI18n } from "@/lib/i18n/with-i18n"
import { toast } from "@/components/ui/use-toast"
import PageView from "@/components/posthog/page-view"

export default withI18n(function VerifyEmail() {
  const searchParams = useSearchParams()
  const [result, setResult] = useState<string | undefined>()

  const { update } = useSession()

  useEffect(() => {
    const emailVerification = async () => {
      const token = searchParams?.get("token")
      const oldEmail = searchParams?.get("oldEmail")
      const newEmail = searchParams?.get("newEmail")
      if (!token || !oldEmail || !newEmail) {
        setResult("Error verifying your email")
        return toast({
          title: i18n.t("Something went wrong"),
          description: i18n.t(
            "Your email verification failed. Please try again"
          ),
          variant: "destructive",
        })
      }

      await HTTP_POST(
        HTTP_POST_PATH.changeEmail,
        JSON.stringify({
          oldEmail,
          newEmail,
          token,
        })
      )

      update({ email: newEmail })

      toast({
        title: i18n.t("Good news"),
        description: i18n.t("Email verified successfully"),
      })
      window.location.replace("/dashboard")
    }

    emailVerification()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <PageView page={PageAnalytics.changeEmail} />
      <div
        className="flex h-screen items-center justify-center flex-col"
        style={{
          backgroundImage:
            "linear-gradient(to right top, #f8f9fa, #e5e8ea, #d2d7db, #bfc6cc, #adb5bd)",
        }}
      >
        <h1 className="font-medium text-3xl">
          {result ? result : "Please wait ..."}
        </h1>
        <div className="mb-4"></div>
      </div>
    </>
  )
})
