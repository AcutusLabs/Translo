import { ProjectLanguage } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"

import { ApiResponseType } from "@/types/api"
import { handleApiError } from "@/lib/exceptions"
import { KeywordData } from "@/components/app/project/types"

export type LanguageProps = Pick<ProjectLanguage, "short" | "name">

const analyzeKeywordToImports = async (
  projectId: string,
  keywords: string[]
): Promise<KeywordData[]> => {
  const result = await axios({
    url: `/api/projects/${projectId}/keywords/import-analyze`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: { keywords },
  })

  return result.data
}

type AnalyzeKeywordToImportsApi = ApiResponseType & {
  projectId: string
}

export const getAnalyzeKeywordToImportsKey = (projectId: string) => [
  "analyzeKeywordToImports",
  projectId,
]

export const useAnalyzeKeywordToImports = ({
  projectId,
  onSuccess,
  showAlertType,
}: AnalyzeKeywordToImportsApi) => {
  return useMutation({
    mutationKey: getAnalyzeKeywordToImportsKey(projectId),
    mutationFn: async (keywords: string[]) =>
      await analyzeKeywordToImports(projectId, keywords),
    onError: (error) => handleApiError(error, showAlertType),
    onSuccess: (data) => onSuccess?.(data),
  })
}
