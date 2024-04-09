import { useMemo } from "react"
import { Formality, Sex, Term } from "@/store/useI18nState"
import { generatePromptTranslation } from "@/utils/OpenAiUtils"

type Props = {
  numberOfLanguages: number
  sentence: string
  context?: string
  description?: string
  glossary?: Term[]
}

export function useCostEstimation(props: Props) {
  const {
    numberOfLanguages,
    sentence,
    context = "example context",
    description = "project description",
    glossary = [],
  } = props
  const costs = useMemo(() => {
    const lengthOfRequest = generatePromptTranslation({
      context,
      translationEn: sentence,
      languagesPropt: new Array(numberOfLanguages).fill("en, ").join(""),
      settings: {
        formality: Formality.Formal,
        description: description,
        audience: [Sex.Male, Sex.Female, Sex.Other],
        glossary,
      },
      agePrompt: "with an age range between 25 and 70 years old.",
      languages: new Array(numberOfLanguages).fill({
        lang: "English",
        short: "en",
        keywords: {},
      }),
    })
    return Math.round(lengthOfRequest.length + sentence.length * 1.2)
  }, [context, description, glossary, numberOfLanguages, sentence])

  return costs
}
