import { Keyword } from "@prisma/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

import { ApiResponseType } from "@/types/api"
import { handleApiError } from "@/lib/exceptions"

import { getKeywordsQueryKey } from "./use-get-keywords"

export type KeywordProps = Pick<Keyword, "keyword" | "context">

const addKeyword = async (projectId: string, keywordProps: KeywordProps) => {
  const result = await axios({
    url: `/api/projects/${projectId}/keywords`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      ...keywordProps,
    },
  })
  return result.data
}

type AddKeywordApi = ApiResponseType & {
  projectId: string
  keywordProps: KeywordProps
}

export const useAddKeyword = ({
  projectId,
  keywordProps,
  onSuccess,
  showAlertType,
}: AddKeywordApi) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["addKeyword", projectId, keywordProps.keyword],
    mutationFn: async () => await addKeyword(projectId, keywordProps),
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
