import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

import { ApiResponseType } from "@/types/api"
import { handleApiError } from "@/lib/exceptions"

import { getProjectQueryKey } from "./use-get-project"

const shareProject = async (projectId: string, shared: boolean) => {
  const result = await axios({
    url: `/api/projects/${projectId}`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      shared,
    },
  })
  return result.data
}

type ShareProjectApi = ApiResponseType & {
  projectId: string
  shared: boolean
}

export const useShareProject = ({
  projectId,
  shared,
  onSuccess,
  showAlertType,
}: ShareProjectApi) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["shareProject", projectId, shared],
    mutationFn: async () => await shareProject(projectId, shared),
    onError: (error) => handleApiError(error, showAlertType),
    onSuccess: (data) => {
      onSuccess?.(data)
      queryClient.cancelQueries({
        queryKey: getProjectQueryKey(projectId),
      })
      queryClient.refetchQueries({
        queryKey: getProjectQueryKey(projectId),
      })
    },
  })
}
