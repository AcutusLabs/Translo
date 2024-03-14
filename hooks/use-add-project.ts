import { useMutation } from "@tanstack/react-query"
import axios from "axios"

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

export const useAddProject = ({ projectName, onSuccess }) => {
  return useMutation({
    mutationKey: ["addProject", projectName],
    mutationFn: async () => await addProject(projectName),
    onError: handleApiError,
    onSuccess,
  })
}
