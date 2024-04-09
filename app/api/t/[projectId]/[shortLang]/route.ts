import { I18nLang } from "@/store/useI18nState"
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

    const project = await db.project.findFirst({
      where: {
        id: params.projectId,
        published: true,
      },
    })

    const language = ((project?.languages as I18nLang[]) || []).find(
      (language) => language.short === params.shortLang
    )

    if (!language) {
      return ErrorResponse({
        error:
          "The project does not exist or is not published, or the short name has not been entered correctly; it should be the short-name, for example, /en",
      })
    }

    return new Response(JSON.stringify(language?.keywords || {}, null, 4))
  } catch (error) {
    return handleCatchApi(error)
  }
}
