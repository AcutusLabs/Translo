import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

import { ApiResponseType } from "@/types/api"
import { handleApiError } from "@/lib/exceptions"
import { KeywordData, LanguageData } from "@/components/app/project/types"

import { TranslationsProps } from "./keyword/translation/use-add-or-edit-translations"
import { getTranslationKey } from "./keyword/translation/use-get-all-translations"
import { getKeywordsQueryKey } from "./keyword/use-get-keywords"
import { getLanguagesQueryKey } from "./language/use-get-languages"
import { askToAI } from "./use-ask-to-ai"

export class SemaphoreTranslation {
  static stopped = false
}

const translateProject = async (
  projectId: string,
  keywords: KeywordData[],
  languages: LanguageData[],
  onUpdate: (progress: number) => void
) => {
  for (let i = 0; i < keywords.length; i++) {
    if (SemaphoreTranslation.stopped) {
      return
    }

    const keyword = keywords[i]

    const isAlreadyTranslated =
      keyword.translations.filter((translation) => translation.value).length ===
      languages.length

    if (isAlreadyTranslated) {
      onUpdate(i / (keywords.length - 1))
      continue
    }

    const sentenceEN = keyword.translations.find(
      (translation) => translation.language.short === "en"
    )

    const response = await askToAI(projectId, keyword.id, sentenceEN?.value)

    const newTranslations: TranslationsProps[] = []

    Object.keys(response).forEach((languageShort) => {
      const language = languages.find((_lang) => _lang.short === languageShort)

      if (!language) {
        return
      }

      const currentTranslation = keyword.translations.find(
        (translation) => translation.language.short === languageShort
      )

      if (!currentTranslation) {
        newTranslations.push({
          projectLanguageId: language.id,
          value: response[languageShort],
        })
      }
    })

    await axios({
      url: `/api/projects/${projectId}/keywords/${keyword.id}/translations`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        translations: newTranslations,
      },
    })

    onUpdate(i / (keywords.length - 1))
  }
}

type TranslateProjectApi = ApiResponseType & {
  languages: LanguageData[]
  projectId: string
  keywords: KeywordData[]
  onUpdate: (progress: number) => void
}

export const translateProjectKey = (projectId: string) => [
  "translateProject",
  projectId,
]

export const useTranslateProject = ({
  keywords,
  projectId,
  languages,
  onUpdate,
  onSuccess,
  onError,
  showAlertType,
}: TranslateProjectApi) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: translateProjectKey(projectId),
    mutationFn: async () => {
      SemaphoreTranslation.stopped = false
      await translateProject(projectId, keywords, languages, onUpdate)
    },
    onError: (error) => {
      onError?.(error)
      handleApiError(error, showAlertType)
    },
    onSuccess: (data) => {
      onSuccess?.(data)
      queryClient.cancelQueries({
        queryKey: getKeywordsQueryKey(projectId),
      })
      queryClient.cancelQueries({
        queryKey: getTranslationKey(projectId),
      })
      queryClient.cancelQueries({
        queryKey: getLanguagesQueryKey(projectId),
      })
      queryClient.refetchQueries({
        queryKey: getKeywordsQueryKey(projectId),
      })
      queryClient.refetchQueries({
        queryKey: getTranslationKey(projectId),
      })
      queryClient.refetchQueries({
        queryKey: getLanguagesQueryKey(projectId),
      })
    },
  })
}
