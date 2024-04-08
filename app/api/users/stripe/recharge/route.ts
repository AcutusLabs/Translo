import { NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { z } from "zod"

import { env } from "@/env.mjs"
import { authOptions } from "@/lib/auth"
import i18n from "@/lib/i18n"
import { ErrorResponse } from "@/lib/response"
import { stripe } from "@/lib/stripe"
import { getUserSubscriptionPlan } from "@/lib/subscription"
import { absoluteUrl } from "@/lib/utils"

const stripeParams = z.object({
  amount: z.string(),
})

const billingUrl = absoluteUrl("/dashboard/billing")

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !session?.user.email) {
      return ErrorResponse({ error: i18n.t("Wrong user"), status: 403 })
    }

    const searchParams = req.nextUrl.searchParams

    const { amount } = stripeParams.parse({
      amount: searchParams.get("amount"),
    })

    const subscriptionPlan = await getUserSubscriptionPlan(session.user.id)

    // The user is on the pro plan.
    // Create a portal session to manage subscription.
    if (subscriptionPlan.isPro && subscriptionPlan.stripeCustomerId) {
      const stripeSession = await stripe.checkout.sessions.create({
        success_url: billingUrl,
        cancel_url: billingUrl,
        payment_method_types: ["card"],
        mode: "payment",
        billing_address_collection: "auto",
        customer_email: session.user.email,
        line_items: [
          {
            quantity: 1,
            adjustable_quantity: {
              enabled: false,
            },
            price_data: {
              currency: "eur",
              product: env.STRIPE_AI_TRANSLATION_PLAN_ID,
              unit_amount: parseFloat(amount) * 100,
            },
          },
        ],
        metadata: {
          userId: session.user.id,
        },
      })

      return new Response(JSON.stringify({ url: stripeSession.url }))
    }

    return new Response(
      i18n.t("You need to be subscribed to recharge your account"),
      { status: 500 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(error.message, { status: 500 })
  }
}
