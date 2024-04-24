import * as z from "zod"

import { db } from "@/lib/db"
import { handleCatchApi } from "@/lib/exceptions"
import i18n from "@/lib/i18n"
import { ErrorResponse, SuccessResponse } from "@/lib/response"

import { verifyCurrentUserHasAccessToProject } from "./route"

export const routeContextSchemaProject = z.object({
  params: z.object({
    projectId: z.string(),
  }),
})

export const projectShareSchema = z.object({
  published: z.any(),
})

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchemaProject>
) {
  try {
    // Validate route params.
    const { params } = routeContextSchemaProject.parse(context)

    // Check if the user has access to this project.
    if (!(await verifyCurrentUserHasAccessToProject(params.projectId))) {
      return ErrorResponse({ error: i18n.t("Wrong user"), status: 403 })
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
