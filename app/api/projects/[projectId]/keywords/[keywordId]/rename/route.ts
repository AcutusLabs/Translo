import * as z from "zod"

import { db } from "@/lib/db"
import { handleCatchApi } from "@/lib/exceptions"
import i18n from "@/lib/i18n"
import { ErrorResponse, SuccessResponse } from "@/lib/response"

import { verifyCurrentUserHasAccessToProject } from "../../../utils"
import { routeContextSchemaProjectKeyword } from "../utils"

const keywordPatchSchema = z.object({
  keyword: z.string(),
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
        keyword: body.keyword,
      },
    })

    return SuccessResponse()
  } catch (error) {
    return handleCatchApi(error)
  }
}
