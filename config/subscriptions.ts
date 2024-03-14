import { SubscriptionPlan } from "types"
import { env } from "@/env.mjs"
import { MAX_PROJECTS_STARTER_URSER } from "@/lib/constants"
import i18n from "@/lib/i18n"

export const freePlan: SubscriptionPlan = {
  name: "Free",
  description: i18n.t(
    "The free plan is limited to {number} project. Upgrade to the PRO plan for unlimited projects.",
    { number: MAX_PROJECTS_STARTER_URSER }
  ),
  stripePriceId: "",
}

export const proPlan: SubscriptionPlan = {
  name: "PRO",
  description: i18n.t("The PRO plan has unlimited projects."),
  stripePriceId: env.STRIPE_PRO_MONTHLY_PLAN_ID || "",
}
