"use client"

import { notFound, redirect } from "next/navigation"
import { Project, User } from "@prisma/client"

import { PageAnalytics } from "@/lib/analytics-client"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import i18n from "@/lib/i18n"
import { withI18n } from "@/lib/i18n/with-i18n"
import { getCurrentUser } from "@/lib/session"
import { Editor } from "@/components/app/project"
import {
  KeywordData,
  LanguageData,
  ProjectSettings,
  TranslationData,
} from "@/components/app/project/types"
import PostHogAnalytics from "@/components/posthog"
import { getTokensByUserId } from "@/app/[lang]/api/users/utils"

async function getProjectForUser(projectId: Project["id"], userId: User["id"]) {
  return await db.project.findFirst({
    where: {
      id: projectId,
      userId,
    },
    include: {
      keywords: {
        include: { translations: true },
      },
      languages: true,
    },
  })
}

interface EditorPageProps {
  params: { projectId: string }
}

export default withI18n(async function EditorPage({ params }: EditorPageProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const tokens = await getTokensByUserId(user.id)

  const project = await getProjectForUser(params.projectId, user.id)

  if (!project) {
    notFound()
  }

  const Analytics = await PostHogAnalytics(PageAnalytics.project)

  const languages: LanguageData[] = project.languages

  const keywords: KeywordData[] = project.keywords.map((keyword) => {
    const translations: TranslationData[] = keyword.translations.map(
      (translation) => {
        const language = languages.find(
          (lang) => lang.id === translation.projectLanguageId
        )

        if (!language) {
          throw i18n.t(
            "There has been an issue with retrieving some translations. Please write to support at translo.help@gmail.com with these details: {details}",
            {
              details: `keyword: ${keyword.keyword}, projectLanguageId: ${translation.projectLanguageId}, keywordId: ${keyword.id}, projectId: ${project.id}, userId: ${user.id}`,
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

  return (
    <>
      {Analytics}
      <Editor
        project={{
          id: project.id,
          title: project.title,
          settings: project.settings as ProjectSettings,
          published: project.published,
          languages,
          keywords,
        }}
        tokens={tokens}
      />
    </>
  )
})
