import { useMutation } from "@tanstack/react-query"
import axios from "axios"

import { ApiResponseType } from "@/types/api"
import { handleApiError } from "@/lib/exceptions"

const addProject = async (projectName) => {
  const result = await axios({
    url: "/api/projects",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      title: projectName,
    },
  })
  return result.data
}

type AddProjectApi = ApiResponseType & {
  projectName: string
}

export const useAddProject = ({
  projectName,
  onSuccess,
  showAlertType,
}: AddProjectApi) => {
  return useMutation({
    mutationKey: ["addProject", projectName],
    mutationFn: async () => await addProject(projectName),
    onError: (error) => handleApiError(error, showAlertType),
    onSuccess,
  })
}
