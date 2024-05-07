import { ProjectLanguage } from "@prisma/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

import { ApiResponseType } from "@/types/api"
import { handleApiError } from "@/lib/exceptions"

import { getLanguagesQueryKey } from "./use-get-languages"

export type LanguageProps = Pick<ProjectLanguage, "short" | "name">

const addLanguage = async (projectId: string, languageProps: LanguageProps) => {
  const result = await axios({
    url: `/api/projects/${projectId}/languages`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      ...languageProps,
    },
  })
  return result.data
}

type AddLanguageApi = ApiResponseType & {
  projectId: string
}

export const useAddLanguage = ({
  projectId,
  onSuccess,
  showAlertType,
}: AddLanguageApi) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["addLanguage", projectId],
    mutationFn: async (languageProps: LanguageProps) =>
      await addLanguage(projectId, languageProps),
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
