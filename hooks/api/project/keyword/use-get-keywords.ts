import { ProjectLanguage } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

import i18n from "@/lib/i18n"
import {
  KeywordData,
  LanguageData,
  TranslationData,
} from "@/components/app/project/types"

export type LanguageProps = Pick<ProjectLanguage, "short" | "name">

const getKeywords = async (
  projectId: string,
  languages: LanguageData[]
): Promise<KeywordData[]> => {
  const result = await axios({
    url: `/api/projects/${projectId}/keywords`,
    method: "GET",
  })

  const keywords: KeywordData[] = result.data.map((keyword) => {
    const translations: TranslationData[] = keyword.translations.map(
      (translation) => {
        const language = languages.find(
          (lang) => lang.id === translation.projectLanguageId
        )

        if (!language) {
          throw i18n.t(
            "There has been an issue with retrieving some translations. Please write to support at translo.help@gmail.com with these details: {details}",
            {
              details: `keyword: ${keyword.keyword}, projectLanguageId: ${translation.projectLanguageId}, keywordId: ${keyword.id}`,
            }
          )
        }

        return {
          ...translation,
          language,
        }
      }
    )
    return {
      ...keyword,
      translations,
    }
  })
  return keywords
}

type GetKeywordsApi = {
  projectId: string
  initialData: {
    keywords: KeywordData[]
    languages: LanguageData[]
  }
}

export const getKeywordsQueryKey = (projectId: string) => [
  "getKeywords",
  projectId,
]

export const useGetKeywords = ({ projectId, initialData }: GetKeywordsApi) => {
  return useQuery<KeywordData[]>({
    queryKey: getKeywordsQueryKey(projectId),
    queryFn: async () => await getKeywords(projectId, initialData.languages),
    initialData: initialData.keywords,
  })
}
