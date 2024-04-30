import { ProjectLanguage } from "@prisma/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

import { ApiResponseType } from "@/types/api"
import { handleApiError } from "@/lib/exceptions"
import i18n from "@/lib/i18n"
import { KeywordData } from "@/components/app/project/types"

import { getKeywordsQueryKey } from "./use-get-keywords"

export type LanguageProps = Pick<ProjectLanguage, "short" | "name">

type Keywords = { [key: string]: string }

const KeywordImports = async (
  projectId: string,
  keywords: Keywords,
  languageId?: string
): Promise<KeywordData[]> => {
  if (!languageId) {
    throw i18n.t("Language is required")
  }
  const result = await axios({
    url: `/api/projects/${projectId}/keywords/import`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: { keywords, languageId },
  })

  return result.data
}

type KeywordsImportsApi = ApiResponseType & {
  projectId: string
  languageId?: string
}

export const getKeywordsImportsKey = (projectId: string) => [
  "KeywordImports",
  projectId,
]

export const useKeywordsImports = ({
  projectId,
  languageId,
  onSuccess,
  showAlertType,
}: KeywordsImportsApi) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: getKeywordsImportsKey(projectId),
    mutationFn: async (keywords: Keywords) =>
      await KeywordImports(projectId, keywords, languageId),
    onError: (error) => handleApiError(error, showAlertType),

    onSuccess: (data) => {
      onSuccess?.(data)
      queryClient.cancelQueries({
        queryKey: getKeywordsQueryKey(projectId),
      })
      queryClient.refetchQueries({
        queryKey: getKeywordsQueryKey(projectId),
      })
    },
  })
}
