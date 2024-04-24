import { ProjectLanguage } from "@prisma/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

import { ApiResponseType } from "@/types/api"
import { handleApiError } from "@/lib/exceptions"

import { getLanguagesQueryKey } from "./use-get-languages"

export type LanguageProps = Pick<ProjectLanguage, "short" | "name">

const editLanguage = async (
  projectId: string,
  languageId: string,
  languageProps: LanguageProps
) => {
  const result = await axios({
    url: `/api/projects/${projectId}/languages/${languageId}`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      ...languageProps,
    },
  })
  return result.data
}

type EditLanguageApi = ApiResponseType & {
  projectId: string
  languageId: string
  languageProps: LanguageProps
}

export const useEditLanguage = ({
  projectId,
  languageId,
  languageProps,
  onSuccess,
  showAlertType,
}: EditLanguageApi) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [
      "editLanguage",
      projectId,
      languageProps.name,
      languageProps.short,
    ],
    mutationFn: async () =>
      await editLanguage(projectId, languageId, languageProps),
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
