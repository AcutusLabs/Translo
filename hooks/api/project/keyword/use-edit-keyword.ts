import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

import { ApiResponseType } from "@/types/api"
import { handleApiError } from "@/lib/exceptions"

import { getLanguagesQueryKey } from "../language/use-get-languages"
import { getTranslationKey } from "./translation/use-get-all-translations"
import { getKeywordsQueryKey } from "./use-get-keywords"

const editKeyword = async (
  projectId: string,
  keywordId: string,
  newKey: string
) => {
  const result = await axios({
    url: `/api/projects/${projectId}/keywords/${keywordId}`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      keyword: newKey,
    },
  })
  return result.data
}

type EditKeywordApi = ApiResponseType & {
  projectId: string
  keywordId: string
  newKey: string
}

export const useEditKeyword = ({
  projectId,
  keywordId,
  newKey,
  onSuccess,
  showAlertType,
}: EditKeywordApi) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["editKeyword", projectId],
    mutationFn: async () => await editKeyword(projectId, keywordId, newKey),
    onError: (error) => handleApiError(error, showAlertType),
    onSuccess: (data) => {
      onSuccess?.(data)
      queryClient.cancelQueries({
        queryKey: getKeywordsQueryKey(projectId),
      })
      queryClient.cancelQueries({
        queryKey: getTranslationKey(projectId, keywordId),
      })
      queryClient.cancelQueries({
        queryKey: getLanguagesQueryKey(projectId),
      })
      queryClient.refetchQueries({
        queryKey: getKeywordsQueryKey(projectId),
      })
      queryClient.refetchQueries({
        queryKey: getTranslationKey(projectId, keywordId),
      })
      queryClient.refetchQueries({
        queryKey: getLanguagesQueryKey(projectId),
      })
    },
  })
}
