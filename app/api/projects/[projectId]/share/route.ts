import * as z from "zod"

import { db } from "@/lib/db"
import { handleCatchApi } from "@/lib/exceptions"
import i18n from "@/lib/i18n"
import { ErrorResponse, SuccessResponse } from "@/lib/response"
import { NOT_ALLOWED_STATUS } from "@/app/api/status"

import {
  routeContextSchemaProject,
  verifyCurrentUserHasAccessToProject,
} from "../utils"

const projectShareSchema = z.object({
  published: z.any(),
})

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchemaProject>
) {
  try {
    const params = await routeContextSchemaProject.parse(context).params

    // Check if the user has access to this project.
    if (!(await verifyCurrentUserHasAccessToProject(params.projectId))) {
      return ErrorResponse({
        error: i18n.t("Wrong user"),
        status: NOT_ALLOWED_STATUS,
      })
    }

    // Get the request body and validate it.
    const json = await req.json()
    const body = projectShareSchema.parse(json)

    await db.project.update({
      where: {
        id: params.projectId,
      },
      data: {
        published: body.published,
      },
    })

    return SuccessResponse()
  } catch (error) {
    return handleCatchApi(error)
  }
}
