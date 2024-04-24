import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

import { ApiResponseType } from "@/types/api"
import { handleApiError } from "@/lib/exceptions"

import { getKeywordsQueryKey } from "./use-get-keywords"

const deleteKeyword = async (projectId: string, keywordId: string) => {
  const result = await axios({
    url: `/api/projects/${projectId}/keywords/${keywordId}`,
    method: "DELETE",
  })
  return result.data
}

type DeleteKeywordApi = ApiResponseType & {
  projectId: string
}

export const useDeleteKeyword = ({
  projectId,
  onSuccess,
  showAlertType,
}: DeleteKeywordApi) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["deleteKeyword", projectId],
    mutationFn: async (keywordId: string) =>
      await deleteKeyword(projectId, keywordId),
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
