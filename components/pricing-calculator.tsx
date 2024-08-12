"use client"

import React, { ChangeEvent, useCallback, useState } from "react"
import { isNumber } from "lodash"

import i18n from "@/lib/i18n"
import { useCostEstimation } from "@/hooks/use-cost-estimation"

import { Input } from "./ui/input"
import { Label } from "./ui/label"

const PricingCalculator = () => {
  const [sentence, setSentence] = useState<string>("Hello")
  const [numberOfLanguages, setNumberOfLanguages] = useState<number>(3)

  const handleChangeSentence = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSentence(e.target.value)
    },
    []
  )

  const handleChangeNumberOfLanguages = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const number = parseInt(e.target.value)
      if (isNumber(number) && !isNaN(number) && number >= 1) {
        setNumberOfLanguages(number)
      }
    },
    []
  )

  const cost = useCostEstimation({
    sentences: [sentence],
    numberOfLanguages,
  })

  return (
    <div className="mt-5">
      <Label htmlFor="username" className="text-right">
        {i18n.t("Sentence to translate")}
      </Label>
      <Input
        className="w-max-[85%] mt-2"
        type="text"
        placeholder="Hello"
        onChange={handleChangeSentence}
        value={sentence}
      />
      <div className="mt-2">
        <Label htmlFor="username" className="text-right">
          {i18n.t("Number of languages")}
        </Label>
        <Input
          className="w-[100px] mt-2"
          type="number"
          placeholder="5"
          onChange={handleChangeNumberOfLanguages}
          value={numberOfLanguages}
        />
      </div>
      <p className="max-w-[85%] leading-normal text-muted-foreground text-sm mt-2">
        {i18n.t("Necessary tokens: ~{tokens}", { tokens: cost })}
      </p>
    </div>
  )
}

export default PricingCalculator
