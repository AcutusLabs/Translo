import { proPlanTokens } from "@/constants/subscriptions"
import Stripe from "stripe"

import { db } from "@/lib/db"
import i18n from "@/lib/i18n"
import { BAD_REQUEST_STATUS } from "@/app/api/status"

export default async function subscriptionCreationByAdmin(
  subscription: Stripe.Subscription
) {
  const user = await db.user.findFirst({
    where: {
      OR: [
        { stripeCustomerId: subscription.customer as string },
        { email: subscription?.metadata?.userEmail },
      ],
    },
  })

  if (!user) {
    return new Response(i18n.t("Stripe payment user not found"), {
      status: BAD_REQUEST_STATUS,
    })
  }

  // Update the user stripe into in our database.
  // Since this is the initial subscription, we need to update
  // the subscription id and customer id.
  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      tokens: user.stripeSubscriptionId
        ? user.tokens
        : Number(user.tokens) + proPlanTokens,
    },
  })
}
