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
    const request = generatePromptTranslation({
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
    const response = `
    {
      ${new Array(numberOfLanguages).fill(`en: ${sentence}`).join(", \n")}
    }`

    // documentation on estimation: https://platform.openai.com/tokenizer
    // despite documentation says that a token is around ~4 characters, with many languages I've seen that for the prompt it's around 3.5 rounded to 3
    // and for the response where there are more symbols it's around 1.5 rounded to 1
    // this is why I'm dividing by 3 and 1
    return Math.round(request.length / 3 + response.length)
  }, [context, description, glossary, numberOfLanguages, sentence])

  return costs
}
