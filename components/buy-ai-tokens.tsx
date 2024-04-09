"use client"

import React, { ChangeEvent, useCallback, useState } from "react"
import { tokensPerCent } from "@/constants/subscriptions"
import { isNumber } from "lodash"

import i18n from "@/lib/i18n"
import { cn } from "@/lib/utils"

import { Icons } from "./icons"
import { buttonVariants } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { toast } from "./ui/use-toast"

const BuyAITokens = () => {
  const [amount, setAmount] = useState<number | undefined>(3)
  const [isLoading, setIsLoading] = useState(false)

  const onRecharge = useCallback(async () => {
    setIsLoading(true)

    // Get a Stripe session URL.
    const response = await fetch(`/api/users/stripe/recharge?amount=${amount}`)

    if (!response?.ok) {
      setIsLoading(false)
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
  }, [amount])

  const handleChangeAmount = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const number = parseFloat(e.target.value)
    if (isNumber(number) && !isNaN(number)) {
      setAmount(number)
    } else if (e.target.value === "") {
      setAmount(undefined)
    }
  }, [])

  return (
    <div className="mt-5">
      <Label htmlFor="username" className="text-right">
        {i18n.t("Amount")}
      </Label>
      <Input
        className="w-[100px] mt-2"
        type="number"
        placeholder="3"
        onChange={handleChangeAmount}
        value={amount}
      />

      {amount === undefined || amount < 3 ? (
        <h6 className="w-full text-red-500 text-xs mt-2">
          {i18n.t(
            "The recharge must be a valid number and equal to or greater than €3"
          )}
        </h6>
      ) : (
        <p
          className="max-w-[85%] leading-normal text-muted-foreground text-sm mt-2"
          dangerouslySetInnerHTML={{
            __html: i18n
              .t("With {amount}€, you will buy {tokens} tokens", {
                amount,
                tokens: amount * tokensPerCent * 100,
              })
              .replace(/(< *script)/gi, "illegalscript"),
          }}
        ></p>
      )}

      <button
        onClick={onRecharge}
        className={cn(buttonVariants(), "w-max mt-5")}
        disabled={isLoading}
      >
        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        {i18n.t("Recharge tokens")}
      </button>
    </div>
  )
}

export default BuyAITokens
