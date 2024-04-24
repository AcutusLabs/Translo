import { ProjectLanguage } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export type LanguageProps = Pick<ProjectLanguage, "short" | "name">

const getProject = async (projectId: string) => {
  const result = await axios({
    url: `/api/projects/${projectId}`,
    method: "GET",
  })
  return result.data
}

type GetProjectApi = {
  projectId: string
}

export const getProjectQueryKey = (projectId: string) => [
  "getProject",
  projectId,
]

export const useGetProject = ({ projectId }: GetProjectApi) => {
  return useQuery({
    queryKey: getProjectQueryKey(projectId),
    queryFn: async () => await getProject(projectId),
  })
}
