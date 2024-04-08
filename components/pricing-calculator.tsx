"use client"

import React, { ChangeEvent, useCallback, useMemo, useState } from "react"
import { Formality, Sex } from "@/store/useI18nState"
import { generatePromptTranslation } from "@/utils/OpenAiUtils"
import { isNumber } from "lodash"

import i18n from "@/lib/i18n"

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

  const costs = useMemo(() => {
    const lengthOfRequest = generatePromptTranslation({
      context: "example context",
      translationEn: sentence,
      languagesPropt: new Array(numberOfLanguages).fill("en, ").join(""),
      settings: {
        formality: Formality.Formal,
        description: "project description",
        audience: [Sex.Male, Sex.Female, Sex.Other],
        glossary: [],
      },
      agePrompt: "with an age range between 25 and 70 years old.",
      languages: new Array(numberOfLanguages).fill({
        lang: "English",
        short: "en",
        keywords: {},
      }),
    })
    return Math.round(lengthOfRequest.length + sentence.length * 1.2)
  }, [numberOfLanguages, sentence])

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
        {i18n.t("Necessary tokens: {tokens}", { tokens: costs })}
      </p>
    </div>
  )
}

export default PricingCalculator
