import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { handleCatchApi } from "@/lib/exceptions"
import i18n from "@/lib/i18n"
import { ErrorResponse } from "@/lib/response"
import { LOGOUT_STATUS, NOT_ALLOWED_STATUS } from "@/app/api/status"

import { verifyCurrentUserHasAccessToProject } from "../../../utils"
import { routeContextSchemaProjectKeyword } from "../utils"

const translationCreateSchema = z.object({
  translations: z.array(
    z.object({
      translationId: z.string().optional(),
      projectLanguageId: z.string(),
      value: z.string(),
    })
  ),
})

const getAllTranslationsByKeyword = async (keywordId: string) => {
  const translations = await db.translation.findMany({
    select: {
      id: true,
      keywordId: true,
      projectLanguageId: true,
      value: true,
      history: true,
    },
    where: {
      keywordId: keywordId,
    },
  })
  return translations
}

export async function GET(
  _req: Request,
  context: z.infer<typeof routeContextSchemaProjectKeyword>
) {
  try {
    const params = await routeContextSchemaProjectKeyword.parse(context).params

    if (!(await verifyCurrentUserHasAccessToProject(params.projectId))) {
      return ErrorResponse({
        error: i18n.t("Wrong user"),
        status: NOT_ALLOWED_STATUS,
      })
    }

    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: LOGOUT_STATUS })
    }

    const result = await getAllTranslationsByKeyword(params.keywordId)
    return new Response(JSON.stringify(result))
  } catch (error) {
    return handleCatchApi(error)
  }
}

export async function POST(
  req: Request,
  context: z.infer<typeof routeContextSchemaProjectKeyword>
) {
  try {
    const params = await routeContextSchemaProjectKeyword.parse(context).params

    if (!(await verifyCurrentUserHasAccessToProject(params.projectId))) {
      return ErrorResponse({
        error: i18n.t("Wrong user"),
        status: NOT_ALLOWED_STATUS,
      })
    }

    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: LOGOUT_STATUS })
    }

    const json = await req.json()
    const body = translationCreateSchema.parse(json)

    for (let i = 0; i < body.translations.length; i++) {
      const translation = body.translations[i]

      if (translation.translationId) {
        const exTranslationDb = await db.translation.findUnique({
          where: {
            id: translation.translationId,
          },
        })

        if (exTranslationDb?.value !== translation.value) {
          await db.translation.update({
            where: {
              id: translation.translationId,
            },
            data: {
              value: translation.value,
              history: exTranslationDb
                ? [
                    exTranslationDb.value,
                    ...(exTranslationDb.history as string[]),
                  ].slice(0, 10)
                : [],
            },
          })
        }
      } else {
        await db.translation.create({
          data: {
            keywordId: params.keywordId,
            projectLanguageId: translation.projectLanguageId,
            value: translation.value,
            history: [],
          },
        })
      }
    }

    const result = await getAllTranslationsByKeyword(params.keywordId)
    return new Response(JSON.stringify(result))
  } catch (error) {
    return handleCatchApi(error)
  }
}
