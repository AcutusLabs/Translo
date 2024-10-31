import { tokensPerCent } from "@/constants/subscriptions"
import Stripe from "stripe"

import {
  eventPayments,
  PaymentAction,
  sendServerPostHogEvent,
} from "@/lib/analytics-server"
import { db } from "@/lib/db"
import i18n from "@/lib/i18n"
import { BAD_REQUEST_STATUS } from "@/app/api/status"

export default async function rechargeTokens(
  event: Stripe.Event,
  session: Stripe.Checkout.Session
) {
  const user = await db.user.findFirst({
    where: {
      id: session?.metadata?.userId,
    },
  })

  if (!user) {
    return new Response(i18n.t("Stripe payment user not found"), {
      status: BAD_REQUEST_STATUS,
    })
  }

  sendServerPostHogEvent((client) => {
    eventPayments(user.id, client, PaymentAction.recharged, {
      amount: (event.data?.object?.["amount_total"] || 0) / 100,
    })
  })

  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      tokens:
        Number(user.tokens || 0) +
        (event.data?.object?.["amount_total"] || 0) * tokensPerCent,
    },
  })
}
