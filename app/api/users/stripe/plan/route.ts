import { NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { z } from "zod"

import { SubscriptionPlanType } from "@/types/subscription"
import { proPlanMonthly, proPlanYearly } from "@/config/subscriptions"
import {
  eventPayments,
  PaymentAction,
  sendServerPostHogEvent,
} from "@/lib/analytics-server"
import { authOptions } from "@/lib/auth"
import i18n from "@/lib/i18n"
import { ErrorResponse } from "@/lib/response"
import { stripe } from "@/lib/stripe"
import { getUserSubscriptionPlan } from "@/lib/subscription"
import { absoluteUrl } from "@/lib/utils"
import {
  INTERNAL_SERVER_ERROR_STATUS,
  LOGOUT_STATUS,
  TYPE_ERROR_STATUS,
} from "@/app/api/status"

const stripeParams = z.object({
  plan: z
    .enum([
      SubscriptionPlanType.Monthly,
      SubscriptionPlanType.Yearly,
      SubscriptionPlanType.Manage,
    ])
    .optional(),
})

const billingUrl = absoluteUrl("/dashboard/billing")

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !session?.user.email) {
      return ErrorResponse({
        error: i18n.t("Wrong user"),
        status: LOGOUT_STATUS,
      })
    }

    const searchParams = req.nextUrl.searchParams

    const { plan } = stripeParams.parse({
      plan: searchParams.get("plan"),
    })

    const subscriptionPlan = await getUserSubscriptionPlan(session.user.id)

    // The user is on the pro plan.
    // Create a portal session to manage subscription.
    if (subscriptionPlan.isPro && subscriptionPlan.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: subscriptionPlan.stripeCustomerId,
        return_url: billingUrl,
      })

      sendServerPostHogEvent((client) => {
        eventPayments(session.user.id, client, PaymentAction.manageSubsctiption)
      })

      return new Response(JSON.stringify({ url: stripeSession.url }))
    }

    // The user is on the free plan.
    // Create a checkout session to upgrade.
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: billingUrl,
      cancel_url: billingUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: session.user.email,
      line_items: [
        {
          price:
            plan === SubscriptionPlanType.Monthly
              ? proPlanMonthly.stripePriceId
              : proPlanYearly.stripePriceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: session.user.id,
      },
    })

    return new Response(JSON.stringify({ url: stripeSession.url }))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), {
        status: TYPE_ERROR_STATUS,
      })
    }

    return new Response(error.message, { status: INTERNAL_SERVER_ERROR_STATUS })
  }
}
