import Stripe from "stripe"

import { db } from "@/lib/db"
import { stripe } from "@/lib/stripe"

export default async function subscriptionRenew(session: Stripe.Invoice) {
  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  )

  // Update the price id and set the new period end.
  await db.user.update({
    where: {
      stripeSubscriptionId: subscription.id,
    },
    data: {
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  })
}
