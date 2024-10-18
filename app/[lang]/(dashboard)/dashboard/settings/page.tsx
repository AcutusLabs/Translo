import { redirect } from "next/navigation"

import { env } from "@/env.mjs"
import { PageAnalytics } from "@/lib/analytics-client"
import { authOptions } from "@/lib/auth"
import { withI18n } from "@/lib/i18n/with-i18n"
import { getCurrentUser } from "@/lib/session"
import { UserForm } from "@/components/app/account/user-form"
import { DashboardHeader } from "@/components/header"
import PostHogAnalytics from "@/components/posthog"
import { DashboardShell } from "@/components/shell"

export const metadata = {
  metadataBase: new URL(`${env.NEXT_PUBLIC_APP_URL}/dashboard/settings`),
  title: "Settings",
  description: "Manage account and website settings.",
}

export default withI18n(async function SettingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const Analytics = await PostHogAnalytics(PageAnalytics.settings)

  return (
    <>
      {Analytics}
      <DashboardShell>
        <DashboardHeader
          heading="Settings"
          text="Manage account and website settings."
        />
        <div className="grid gap-10">
          <UserForm
            user={{
              id: user.id,
              name: user.name || "",
              email: user.email || "",
              lang: user.lang,
            }}
          />
        </div>
      </DashboardShell>
    </>
  )
})
