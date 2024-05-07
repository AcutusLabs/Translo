import { ProjectLanguage } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

import { LanguageData } from "@/components/app/project/types"

export type LanguageProps = Pick<ProjectLanguage, "short" | "name">

const getLanguages = async (projectId: string) => {
  const result = await axios({
    url: `/api/projects/${projectId}/languages`,
    method: "GET",
  })
  return result.data
}

type GetLanguagesApi = {
  projectId: string
  initialData: LanguageData[]
}

export const getLanguagesQueryKey = (projectId: string) => [
  "getLanguages",
  projectId,
]

export const useGetLanguages = ({
  projectId,
  initialData,
}: GetLanguagesApi) => {
  return useQuery<LanguageData[]>({
    queryKey: getLanguagesQueryKey(projectId),
    queryFn: async () => await getLanguages(projectId),
    initialData,
  })
}
