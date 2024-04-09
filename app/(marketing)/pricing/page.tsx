import Link from "next/link"
import { freePlanTokens, proPlanTokens } from "@/constants/subscriptions"

import {
  MAX_KEYWORDS_STARTER_URSER,
  MAX_PROJECTS_STARTER_URSER,
  PRO_PLAN_PRICING_MONTHLY,
  PRO_PLAN_PRICING_YEARLY,
} from "@/lib/constants"
import i18n from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Icons } from "@/components/icons"
import PricingCalculator from "@/components/pricing-calculator"

export const metadata = {
  title: "Pricing",
}

export default function PricingPage() {
  return (
    <section className="container flex flex-col  gap-6 py-8 md:max-w-[64rem] md:py-12 lg:py-24">
      <div className="mx-auto flex w-full flex-col gap-4 md:max-w-[58rem]">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          {i18n.t("Simple, transparent pricing")}
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          {i18n.t("Unlock all features and grow your business.")}
        </p>
      </div>
      <div className="w-full rounded-lg border p-10">
        <div className="grid items-start gap-10 md:grid-cols-[1fr_150px_150px]">
          <div className="grid gap-6">
            <h3 className="text-xl font-bold sm:text-2xl">
              {i18n.t("What's included in the PRO plan")}
            </h3>
            <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-1">
              <li className="flex items-center">
                <Icons.check className="mr-2 h-4 w-4" />
                {i18n.t("Unlimited projects")}
              </li>
              <li className="flex items-center">
                <Icons.check className="mr-2 h-4 w-4" />
                {i18n.t("Unlimited keywords")}
              </li>
              <li className="flex items-center">
                <Icons.minus className="mr-2 h-4 w-4" />
                {i18n.t("{number} tokens AI translations one-time", {
                  number: `${proPlanTokens / 1000}k`,
                })}
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-4 text-center">
            <div>
              <h4 className="text-5xl font-bold mb-2">
                {PRO_PLAN_PRICING_MONTHLY}
              </h4>
              <p className="text-sm font-medium text-muted-foreground">
                {i18n.t("Billed Monthly")}
              </p>
            </div>
            <Link href="/login" className={cn(buttonVariants({ size: "lg" }))}>
              {i18n.t("Get started")}
            </Link>
          </div>
          <div className="flex flex-col gap-4 text-center">
            <div>
              <h4 className="text-5xl font-bold mb-2">
                {PRO_PLAN_PRICING_YEARLY}
              </h4>
              <p className="text-sm font-medium text-muted-foreground">
                {i18n.t("Billed Yearly")}
              </p>
            </div>
            <Link href="/login" className={cn(buttonVariants({ size: "lg" }))}>
              {i18n.t("Get started")}
            </Link>
          </div>
        </div>
        <Separator className="my-8 w-full" />
        <h3 className="text-xl font-bold sm:text-2xl">
          {i18n.t("Do you need more AI translations?")}
        </h3>
        <p className="max-w-[85%] leading-normal text-muted-foreground text-sm mt-3">
          {i18n.t("To buy more AI tokens, a subscription is required")}
        </p>
        <p className="max-w-[85%] leading-normal text-muted-foreground text-sm mt-3">
          {i18n.t(
            "The costs associated with each AI translation impact our expenses, so to simplify management and provide the best pricing service, a recharge will be required"
          )}
        </p>
        <p className="max-w-[85%] leading-normal text-muted-foreground text-sm mt-3">
          {i18n.t(
            "Each token represents a character of the text prompt we send to the AI and each character of the response, so the cost in tokens of each translation may vary depending on the length of the text and the number of languages in which to translate the phrase"
          )}
        </p>
        <p
          className="max-w-[85%] leading-normal text-muted-foreground text-sm mt-5"
          dangerouslySetInnerHTML={{
            __html: i18n
              .t(
                "You can buy as many as you need, by recharging your account; the price is €4/1M tokens (Million)."
              )
              .replace(/(< *script)/gi, "illegalscript"),
          }}
        ></p>

        <PricingCalculator />
      </div>

      <div className="mx-auto flex w-full flex-col gap-4 md:max-w-[58rem] mt-10">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          {i18n.t("Or try it for free")}
        </h2>
      </div>
      <div className="grid w-full items-start gap-10 rounded-lg border p-10 md:grid-cols-[1fr_150px]">
        <div className="grid gap-6">
          <h3 className="text-xl font-bold sm:text-2xl">
            {i18n.t("What's included in the Free plan")}
          </h3>
          <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-1">
            <li className="flex items-center">
              <Icons.minus className="mr-2 h-4 w-4" />
              {i18n.t("{MAX_PROJECTS_STARTER_URSER} project", {
                MAX_PROJECTS_STARTER_URSER,
              })}
            </li>
            <li className="flex items-center">
              <Icons.minus className="mr-2 h-4 w-4" />
              {i18n.t("{MAX_KEYWORDS_STARTER_URSER} keywords", {
                MAX_KEYWORDS_STARTER_URSER,
              })}
            </li>
            <li className="flex items-center">
              <Icons.minus className="mr-2 h-4 w-4" />
              {i18n.t("{number} tokens AI translations one-time", {
                number: `${freePlanTokens / 1000}k`,
              })}
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-4 text-center">
          <div>
            <h4 className="text-5xl font-bold mb-2">{i18n.t("Free")}</h4>
          </div>
          <Link href="/login" className={cn(buttonVariants({ size: "lg" }))}>
            {i18n.t("Get started")}
          </Link>
        </div>
      </div>
    </section>
  )
}
