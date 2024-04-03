import { SubscriptionPlan } from "types"
import { env } from "@/env.mjs"
import {
  MAX_KEYWORDS_STARTER_URSER,
  MAX_PROJECTS_STARTER_URSER,
} from "@/lib/constants"
import i18n from "@/lib/i18n"

export const freePlan: SubscriptionPlan = {
  name: "Free",
  description: i18n.t(
    "The free plan is limited to {projects} project and {keywords} keywords. Upgrade to the PRO plan for unlimited projects.",
    {
      projects: MAX_PROJECTS_STARTER_URSER,
      keywords: MAX_KEYWORDS_STARTER_URSER,
    }
  ),
  stripePriceId: "",
}

export const proPlanMonthly: SubscriptionPlan = {
  name: "Pro",
  description: i18n.t("The PRO plan has unlimited projects."),
  stripePriceId: env.STRIPE_PRO_MONTHLY_PLAN_ID || "",
}

export const proPlanYearly: SubscriptionPlan = {
  name: "Pro",
  description: i18n.t("The PRO plan has unlimited projects."),
  stripePriceId: env.STRIPE_PRO_YEARLY_PLAN_ID || "",
}
