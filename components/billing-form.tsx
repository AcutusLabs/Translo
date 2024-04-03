"use client"

import * as React from "react"

import { UserSubscriptionPlan } from "types"
import { SubscriptionPlanType } from "@/types/subscription"
import {
  PRO_PLAN_PRICING_MONTHLY,
  PRO_PLAN_PRICING_YEARLY,
} from "@/lib/constants"
import i18n from "@/lib/i18n"
import { cn, formatDate } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

import { Separator } from "./ui/separator"

enum LoadingType {
  Manage = "Manage",
  Yearly = "Yearly",
  Monthly = "Monthly",
}

interface BillingFormProps extends React.HTMLAttributes<HTMLFormElement> {
  subscriptionPlan: UserSubscriptionPlan & {
    isCanceled: boolean
  }
}

export function BillingForm({ subscriptionPlan }: BillingFormProps) {
  const [isLoading, setIsLoading] = React.useState<LoadingType | undefined>(
    undefined
  )

  const onSubmit = async (plan: SubscriptionPlanType) => {
    switch (plan) {
      case SubscriptionPlanType.Monthly:
        setIsLoading(LoadingType.Monthly)
        break
      case SubscriptionPlanType.Yearly:
        setIsLoading(LoadingType.Yearly)
        break
      case SubscriptionPlanType.Manage:
        setIsLoading(LoadingType.Manage)
        break
    }

    // Get a Stripe session URL.
    const response = await fetch(`/api/users/stripe?plan=${plan}`)

    if (!response?.ok) {
      setIsLoading(undefined)
      return toast({
        title: i18n.t("Something went wrong"),
        description: i18n.t("Please try again or contact support"),
        variant: "destructive",
      })
    }

    // Redirect to the Stripe session.
    // This could be a checkout page for initial upgrade.
    // Or portal to manage existing subscription.
    const session = await response.json()
    if (session) {
      window.location.href = session.url
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{i18n.t("Subscription Plan")}</CardTitle>
        <CardDescription>
          <span
            dangerouslySetInnerHTML={{
              __html: i18n
                .t("You are currently on the {name} plan.", {
                  name: subscriptionPlan.name,
                })
                .replace(/(< *script)/gi, "illegalscript"),
            }}
          />
        </CardDescription>
      </CardHeader>
      <CardContent>{subscriptionPlan.description}</CardContent>
      <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
        {subscriptionPlan.isPro ? (
          <div className="flex flex-col">
            <button
              onClick={() => onSubmit(SubscriptionPlanType.Manage)}
              className={cn(buttonVariants())}
              disabled={isLoading === LoadingType.Manage}
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {i18n.t("Manage Subscription")}
            </button>
            <p className="rounded-full text-xs font-medium mt-3">
              {subscriptionPlan.isCanceled
                ? i18n.t("Your plan will be canceled on {date}", {
                    date: formatDate(subscriptionPlan.stripeCurrentPeriodEnd),
                  })
                : i18n.t("Your plan renews on {date}", {
                    date: formatDate(subscriptionPlan.stripeCurrentPeriodEnd),
                  })}
            </p>
          </div>
        ) : (
          <div className="flex flex-col w-full">
            <Separator className="my-4" />
            <div className="grid gap-10 md:grid-cols-[1fr_150px_150px] mr-8 mt-5">
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
                <div
                  onClick={() => onSubmit(SubscriptionPlanType.Monthly)}
                  className={cn(buttonVariants({ size: "lg" }))}
                >
                  {isLoading === LoadingType.Monthly ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    i18n.t("Select plan")
                  )}
                </div>
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
                <div
                  onClick={() => onSubmit(SubscriptionPlanType.Yearly)}
                  className={cn(buttonVariants({ size: "lg" }))}
                >
                  {isLoading === LoadingType.Yearly ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    i18n.t("Select plan")
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
