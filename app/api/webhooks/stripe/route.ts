import { headers } from "next/headers"
import { PaymentType } from "@/constants/subscriptions"
import Stripe from "stripe"

import { env } from "@/env.mjs"
import { SuccessResponse } from "@/lib/response"
import { stripe } from "@/lib/stripe"

import { BAD_REQUEST_STATUS } from "../../status"
import rechargeTokens from "./events/recharge-tokens"
import subscriptionCreation from "./events/subscription-creation"
import subscriptionCreationByAdmin from "./events/subscription-creation-by-admin"
import subscriptionRenew from "./events/subscription-renew"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    )
  } catch (error) {
    return new Response(`Webhook Error: ${error.message}`, {
      status: BAD_REQUEST_STATUS,
    })
  }

  const stripeObject = event.data.object

  if (event.type === "checkout.session.completed") {
    const session = stripeObject as Stripe.Checkout.Session

    if (session?.metadata?.type === PaymentType.RechargeTokens) {
      await rechargeTokens(event, session)
    } else {
      await subscriptionCreation(session)
    }
  }

  if (event.type === "customer.subscription.created") {
    const subscription = stripeObject as Stripe.Subscription
    await subscriptionCreationByAdmin(subscription)
  }

  if (event.type === "invoice.payment_succeeded") {
    const session = stripeObject as Stripe.Invoice
    await subscriptionRenew(session)
  }

  return SuccessResponse()
}
