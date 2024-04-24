import * as z from "zod"

import { db } from "@/lib/db"
import { handleCatchApi } from "@/lib/exceptions"
import i18n from "@/lib/i18n"
import { ErrorResponse, SuccessResponse } from "@/lib/response"

import { verifyCurrentUserHasAccessToProject } from "../../../route"

const keywordPatchSchema = z.object({
  context: z.string(),
})

export const routeContextSchemaProjectKeyword = z.object({
  params: z.object({
    projectId: z.string(),
    keywordId: z.string(),
  }),
})

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchemaProjectKeyword>
) {
  try {
    const { params } = routeContextSchemaProjectKeyword.parse(context)

    if (!(await verifyCurrentUserHasAccessToProject(params.projectId))) {
      return ErrorResponse({ error: i18n.t("Wrong user"), status: 403 })
    }

    const json = await req.json()
    const body = keywordPatchSchema.parse(json)

    await db.keyword.update({
      where: {
        id: params.keywordId,
      },
      data: {
        context: body.context,
      },
    })

    return SuccessResponse()
  } catch (error) {
    return handleCatchApi(error)
  }
}
