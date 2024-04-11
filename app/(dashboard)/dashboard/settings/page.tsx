import { redirect } from "next/navigation"

import { PageAnalytics } from "@/lib/analytics-client"
import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { UserForm } from "@/components/app/account/user-form"
import { DashboardHeader } from "@/components/header"
import PostHogAnalytics from "@/components/posthog"
import { DashboardShell } from "@/components/shell"

export const metadata = {
  title: "Settings",
  description: "Manage account and website settings.",
}

export default async function SettingsPage() {
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
            }}
          />
        </div>
      </DashboardShell>
    </>
  )
}
