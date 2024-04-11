import { UserSubscriptionPlan } from "@/types"

import { PageAnalytics } from "@/lib/analytics-client"
import { getCurrentUser } from "@/lib/session"
import { getUserSubscriptionPlan } from "@/lib/subscription"
import { getBrowserLanguage } from "@/lib/utils"

import PageView from "./page-view"
import UserInfo from "./user-info"

export default async function PostHogAnalytics(page: PageAnalytics) {
  const user = await getCurrentUser()

  let subscriptionPlan: UserSubscriptionPlan | undefined = undefined
  if (user) {
    subscriptionPlan = await getUserSubscriptionPlan(user.id)
  }

  return (
    <>
      <PageView page={page} />
      {user && subscriptionPlan && user.email && (
        <UserInfo
          id={user.id}
          subscription={subscriptionPlan.key}
          email={user.email}
          language={getBrowserLanguage()}
          name={user.name || "unset"}
        />
      )}
    </>
  )
}
