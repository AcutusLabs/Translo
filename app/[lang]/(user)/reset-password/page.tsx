"use client"

import { ChangeEvent, useCallback, useState } from "react"
import { useSearchParams } from "next/navigation"

import { PageAnalytics } from "@/lib/analytics-client"
import { HTTP_POST, HTTP_POST_PATH } from "@/lib/api"
import i18n from "@/lib/i18n"
import { withI18n } from "@/lib/i18n/with-i18n"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import PageView from "@/components/posthog/page-view"

export default withI18n(function VerifyEmail() {
  const searchParams = useSearchParams()

  const email = searchParams?.get("email")
  const token = searchParams?.get("token")

  const [newPassword, setNewPassword] = useState<string | undefined>(undefined)

  const handleChangePassword = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setNewPassword(e.target.value)
    },
    []
  )

  const onSubmit = useCallback(async () => {
    if (!email || !token || !newPassword) {
      return toast({
        title: i18n.t("Something went wrong"),
        description: i18n.t("Missing parameters. Please try again"),
        variant: "destructive",
      })
    }

    await HTTP_POST(
      HTTP_POST_PATH.resetPassword,
      JSON.stringify({
        email,
        token,
        newPassword,
      })
    )

    toast({
      title: i18n.t("Password changed"),
      description: i18n.t("The password has been updated successfully"),
    })

    window.location.replace("/login")
  }, [email, newPassword, token])

  return (
    <>
      <PageView page={PageAnalytics.resetPassword} />
      <div
        className="flex h-screen flex-col items-center justify-center"
        style={{
          backgroundImage:
            "linear-gradient(to right top, #f8f9fa, #e5e8ea, #d2d7db, #bfc6cc, #adb5bd)",
        }}
      >
        <div className="relative z-10 mt-5 rounded-xl border bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:mt-10 md:p-10">
          <h1 className="text-3xl font-medium">
            {i18n.t("Reset your password")}
          </h1>
          <div className="my-6">
            <label
              htmlFor="hs-feedback-post-comment-name-1"
              className="mb-2 block text-sm font-medium dark:text-white"
            >
              {i18n.t("New password")}
            </label>
            <input
              type="password"
              id="hs-feedback-post-comment-name-1"
              className="t-textarea"
              placeholder="password"
              value={newPassword}
              onChange={handleChangePassword}
            />
            <Button className="mt-6" onClick={onSubmit} disabled={!newPassword}>
              {i18n.t("Change password")}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
})
