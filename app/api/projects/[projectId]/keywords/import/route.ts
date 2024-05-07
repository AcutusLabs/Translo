import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { handleCatchApi } from "@/lib/exceptions"
import i18n from "@/lib/i18n"
import { ErrorResponse, SuccessResponse } from "@/lib/response"

import {
  routeContextSchemaProject,
  verifyCurrentUserHasAccessToProject,
} from "../../route"

const keywordImportSchema = z.object({
  keywords: z.record(z.string()),
  languageId: z.string(),
})

export async function POST(
  req: Request,
  context: z.infer<typeof routeContextSchemaProject>
) {
  try {
    const { params } = routeContextSchemaProject.parse(context)

    if (!(await verifyCurrentUserHasAccessToProject(params.projectId))) {
      return ErrorResponse({ error: i18n.t("Wrong user"), status: 403 })
    }

    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const json = await req.json()
    const body = keywordImportSchema.parse(json)

    const projectLanguageId = await db.projectLanguage.findUnique({
      where: {
        id: body.languageId,
      },
      select: {
        id: true,
      },
    })

    if (!projectLanguageId) {
      return ErrorResponse({ error: i18n.t("Language not found"), status: 404 })
    }

    const keywordsAlreadyExists = await db.keyword.findMany({
      where: {
        keyword: {
          in: Object.keys(body.keywords),
        },
        projectId: params.projectId,
      },
      select: {
        id: true,
        keyword: true,
      },
    })

    const keywordsToUpdate = keywordsAlreadyExists.map((keyword) => ({
      keyword: keyword.keyword,
      id: keyword.id,
      value: body.keywords[keyword.keyword],
    }))
    const keywordsToCreate = Object.keys(body.keywords).filter(
      (keyword) =>
        !keywordsToUpdate.map((keyword) => keyword.keyword).includes(keyword)
    )

    for (let i = 0; i < keywordsToUpdate.length; i++) {
      const keywordToUpdate = keywordsToUpdate[i]
      const result = await db.translation.updateMany({
        where: {
          keywordId: keywordToUpdate.id,
          projectLanguageId: projectLanguageId.id,
        },
        data: {
          value: keywordToUpdate.value,
        },
      })

      if (result.count === 0) {
        await db.translation.create({
          data: {
            value: body.keywords[keywordToUpdate.keyword],
            projectLanguageId: projectLanguageId.id,
            keywordId: keywordToUpdate.id,
          },
        })
      }
    }

    for (let i = 0; i < keywordsToCreate.length; i++) {
      const keywordToCreate = keywordsToCreate[i]
      await db.keyword.create({
        data: {
          keyword: keywordToCreate,
          projectId: params.projectId,
          context: "",
          translations: {
            create: {
              value: body.keywords[keywordToCreate],
              projectLanguageId: projectLanguageId.id,
            },
          },
        },
      })
    }

    return SuccessResponse()
  } catch (error) {
    return handleCatchApi(error)
  }
}
