import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

import { ApiResponseType } from "@/types/api"
import { handleApiError } from "@/lib/exceptions"

import { getKeywordsQueryKey } from "../use-get-keywords"

export type TranslationsProps = {
  translationId?: string
  projectLanguageId: string
  value: string
}

const addOrEditTranslations = async (
  projectId: string,
  keywordId: string,
  translationsProps: TranslationsProps[]
) => {
  const result = await axios({
    url: `/api/projects/${projectId}/keywords/${keywordId}/translations`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      translations: translationsProps,
    },
  })
  return result.data
}

type AddOrEditTranslationsApi = ApiResponseType & {
  keywordId: string
  projectId: string
  translationsProps: TranslationsProps[]
}

export const useAddOrEditTranslations = ({
  keywordId,
  projectId,
  translationsProps,
  onSuccess,
  showAlertType,
}: AddOrEditTranslationsApi) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["addOrEditTranslations", projectId, keywordId],
    mutationFn: async () =>
      await addOrEditTranslations(projectId, keywordId, translationsProps),
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
