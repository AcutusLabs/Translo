import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

import { ApiResponseType } from "@/types/api"
import { handleApiError } from "@/lib/exceptions"

import { getLanguagesQueryKey } from "./use-get-languages"

const deleteLanguage = async (projectId: string, languageId: string) => {
  const result = await axios({
    url: `/api/projects/${projectId}/languages/${languageId}`,
    method: "DELETE",
  })
  return result.data
}

type DeleteLanguageApi = ApiResponseType & {
  projectId: string
}

export const useDeleteLanguage = ({
  projectId,
  onSuccess,
  showAlertType,
}: DeleteLanguageApi) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["deleteLanguage", projectId],
    mutationFn: async (languageId: string) =>
      await deleteLanguage(projectId, languageId),
    onError: (error) => handleApiError(error, showAlertType),
    onSuccess: (data) => {
      onSuccess?.(data)
      queryClient.cancelQueries({
        queryKey: getLanguagesQueryKey(projectId),
      })
      queryClient.refetchQueries({
        queryKey: getLanguagesQueryKey(projectId),
      })
    },
  })
}
