import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export type TranslationProps = {
  translationId: string
  projectLanguageId: string
  value: string
  history: string
}

const getAllTranslation = async (
  projectId: string,
  keywordId: string,
  translationProps: TranslationProps
) => {
  const result = await axios({
    url: `/api/projects/${projectId}/keywords/${keywordId}`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      ...translationProps,
    },
  })
  return result.data
}

type GetTranslationApi = {
  keywordId: string
  projectId: string
  translationProps: TranslationProps
}

export const useGetTranslation = ({
  keywordId,
  projectId,
  translationProps,
}: GetTranslationApi) => {
  return useQuery({
    queryKey: ["getAllTranslation", projectId, keywordId],
    queryFn: async () =>
      await getAllTranslation(projectId, keywordId, translationProps),
  })
}
