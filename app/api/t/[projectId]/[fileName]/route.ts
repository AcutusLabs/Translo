import { I18nLang } from "@/store/useI18nState"
import { z } from "zod"

import { db } from "@/lib/db"
import { ErrorResponse, GenericErrorResponse } from "@/lib/response"

const routeContextSchema = z.object({
  params: z.object({
    projectId: z.string(),
    fileName: z.string(),
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

    const languageToExport = params.fileName.replaceAll(".json", "")

    const language = ((project?.languages as I18nLang[]) || []).find(
      (language) => language.short === languageToExport
    )

    if (!language) {
      return ErrorResponse(
        "The project does not exist or is not published, or the short name has not been entered correctly; it should be [short-name].json, for example, en.json"
      )
    }

    return new Response(JSON.stringify(language?.keywords || {}, null, 4))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return GenericErrorResponse()
  }
}
