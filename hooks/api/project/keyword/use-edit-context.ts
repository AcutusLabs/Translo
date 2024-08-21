import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

import { ApiResponseType } from "@/types/api"
import { handleApiError } from "@/lib/exceptions"

import { getKeywordsQueryKey } from "./use-get-keywords"

const editContext = async (
  projectId: string,
  keywordId: string,
  context: string
) => {
  const result = await axios({
    url: `/api/projects/${projectId}/keywords/${keywordId}/context`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      context,
    },
  })
  return result.data
}

type EditContextApi = ApiResponseType & {
  projectId: string
  keywordId: string
  context: string
}

export const useEditContext = ({
  projectId,
  keywordId,
  context,
  onSuccess,
  showAlertType,
}: EditContextApi) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["editContext", projectId],
    mutationFn: async () => await editContext(projectId, keywordId, context),
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
