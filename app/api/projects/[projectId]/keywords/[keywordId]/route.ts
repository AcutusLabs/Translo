import * as z from "zod"

import { db } from "@/lib/db"
import { handleCatchApi } from "@/lib/exceptions"
import i18n from "@/lib/i18n"
import { ErrorResponse, SuccessResponse } from "@/lib/response"

import { verifyCurrentUserHasAccessToProject } from "../../utils"
import { routeContextSchemaProjectKeyword } from "./utils"

const keywordPatchSchema = z.object({
  context: z.string(),
})

export async function DELETE(
  _req: Request,
  context: z.infer<typeof routeContextSchemaProjectKeyword>
) {
  try {
    const { params } = routeContextSchemaProjectKeyword.parse(context)

    if (!(await verifyCurrentUserHasAccessToProject(params.projectId))) {
      return ErrorResponse({ error: i18n.t("Wrong user"), status: 403 })
    }

    await db.keyword.delete({
      where: {
        id: params.keywordId as string,
      },
    })

    return SuccessResponse()
  } catch (error) {
    return handleCatchApi(error)
  }
}

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

    const newData: typeof body = {
      context: body.context,
    }

    await db.keyword.update({
      where: {
        id: params.keywordId,
      },
      data: newData,
    })

    return SuccessResponse()
  } catch (error) {
    return handleCatchApi(error)
  }
}
