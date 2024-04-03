import { getServerSession } from "next-auth/next"

import { UserSubscriptionPlan } from "types"
import { freePlan, proPlanMonthly } from "@/config/subscriptions"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

import { Unauthorized } from "./exceptions"

export async function getUserSubscriptionPlan(
  userId: string
): Promise<UserSubscriptionPlan> {
  const user = await db.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  })

  if (!user) {
    throw new Unauthorized()
  }

  // Check if user is on a pro plan.
  const isPro =
    user.stripePriceId &&
    // @ts-ignore
    user.stripeCurrentPeriodEnd?.getTime() + 86_400_000 > Date.now()

  const plan = isPro ? proPlanMonthly : freePlan

  return {
    ...plan,
    ...user,
    // @ts-ignore
    stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd?.getTime(),
    // @ts-ignore
    isPro,
  }
}

export async function isUserPro() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new Response("Unauthorized", { status: 403 })
  }

  const { user } = session
  const subscriptionPlan = await getUserSubscriptionPlan(user.id)

  return subscriptionPlan?.isPro ?? false
}
