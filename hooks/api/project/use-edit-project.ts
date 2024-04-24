import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

import { ApiResponseType } from "@/types/api"
import { handleApiError } from "@/lib/exceptions"
import { ProjectSettings } from "@/components/app/project/types"

import { getProjectQueryKey } from "./use-get-project"

type EditProjectProps = {
  title?: string
  settings?: ProjectSettings
}

const editProject = async (
  projectId: string,
  projectProps: EditProjectProps
) => {
  const result = await axios({
    url: `/api/projects/${projectId}`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      ...projectProps,
    },
  })
  return result.data
}

type EditProjectApi = ApiResponseType & {
  projectId: string
  projectProps: EditProjectProps
}

export const useEditProject = ({
  projectId,
  projectProps,
  onSuccess,
  showAlertType,
}: EditProjectApi) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["editProject", projectId, projectProps],
    mutationFn: async () => await editProject(projectId, projectProps),
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
