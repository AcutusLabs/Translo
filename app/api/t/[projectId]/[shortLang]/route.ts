import { z } from "zod"

import { db } from "@/lib/db"
import { handleCatchApi } from "@/lib/exceptions"
import { ErrorResponse } from "@/lib/response"

const routeContextSchema = z.object({
  params: z.object({
    projectId: z.string(),
    shortLang: z.string(),
  }),
})

export async function GET(
  _req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const { params } = routeContextSchema.parse(context)

    const projectLanguageId = await db.projectLanguage.findFirst({
      where: {
        short: params.shortLang,
        projectId: params.projectId,
      },
    })

    if (!projectLanguageId) {
      return ErrorResponse({
        error:
          "The project does not exist or is not published, or the short name has not been entered correctly; it should be the short-name, for example, /en",
      })
    }

    const project = await db.project.findFirst({
      where: {
        id: params.projectId,
        published: true,
      },
      include: {
        keywords: {
          include: {
            translations: {
              where: {
                projectLanguageId: projectLanguageId?.id,
              },
            },
          },
        },
      },
    })

    if (!project) {
      return ErrorResponse({
        error:
          "The project does not exist or is not published, or the short name has not been entered correctly; it should be the short-name, for example, /en",
      })
    }

    const translation = project.keywords.reduce((acc, keyword) => {
      if (!keyword.translations.length) {
        return acc
      }
      return {
        ...acc,
        [keyword.keyword]: keyword.translations[0].value,
      }
    }, {})

    return new Response(JSON.stringify(translation || {}, null, 4))
  } catch (error) {
    return handleCatchApi(error)
  }
}
