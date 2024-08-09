import { getServerSession } from "next-auth"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { handleCatchApi } from "@/lib/exceptions"
import i18n from "@/lib/i18n"
import { ErrorResponse, SuccessResponse } from "@/lib/response"

import {
  projectPatchSchema,
  routeContextSchemaProject,
  verifyCurrentUserHasAccessToProject,
} from "./utils"

export async function GET(
  _req: Request,
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

    const project = await db.project.findUnique({
      where: {
        id: params.projectId,
      },
    })

    return new Response(JSON.stringify(project))
  } catch (error) {
    return handleCatchApi(error)
  }
}

export async function DELETE(
  _req: Request,
  context: z.infer<typeof routeContextSchemaProject>
) {
  try {
    // Validate the route params.
    const { params } = routeContextSchemaProject.parse(context)

    // Check if the user has access to this project.
    if (!(await verifyCurrentUserHasAccessToProject(params.projectId))) {
      return ErrorResponse({ error: i18n.t("Wrong user"), status: 403 })
    }

    // Delete the translation.
    await db.project.delete({
      where: {
        id: params.projectId as string,
      },
    })

    return SuccessResponse()
  } catch (error) {
    return handleCatchApi(error)
  }
}

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
    const body = projectPatchSchema.parse(json)

    const newData: typeof body = {}

    if (body.title) {
      newData.title = body.title
    }
    if (body.settings) {
      newData.settings = body.settings
    }

    await db.project.update({
      where: {
        id: params.projectId,
      },
      data: newData,
    })

    return SuccessResponse()
  } catch (error) {
    return handleCatchApi(error)
  }
}
