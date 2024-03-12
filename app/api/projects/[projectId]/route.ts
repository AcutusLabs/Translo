import { getServerSession } from "next-auth"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import {
  ErrorResponse,
  GenericErrorResponse,
  SuccessResponse,
} from "@/lib/response"
import { projectPatchSchema } from "@/lib/validations/translation"

const routeContextSchema = z.object({
  params: z.object({
    projectId: z.string(),
  }),
})

export async function DELETE(
  _req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate the route params.
    const { params } = routeContextSchema.parse(context)

    // Check if the user has access to this translation.
    if (!(await verifyCurrentUserHasAccessTotranslation(params.projectId))) {
      return ErrorResponse("User wrong", 403)
    }

    // Delete the translation.
    await db.project.delete({
      where: {
        id: params.projectId as string,
      },
    })

    return SuccessResponse(204)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return GenericErrorResponse()
  }
}

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate route params.
    const { params } = routeContextSchema.parse(context)

    // Check if the user has access to this translation.
    if (!(await verifyCurrentUserHasAccessTotranslation(params.projectId))) {
      return ErrorResponse("User wrong", 403)
    }

    // Get the request body and validate it.
    const json = await req.json()
    const body = projectPatchSchema.parse(json)

    await db.project.update({
      where: {
        id: params.projectId,
      },
      data: {
        title: body.title,
        languages: body.languages,
        info: body.info,
        settings: body.settings,
        published: body.published,
      },
    })

    return SuccessResponse()
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return GenericErrorResponse()
  }
}

async function verifyCurrentUserHasAccessTotranslation(translationId: string) {
  const session = await getServerSession(authOptions)
  const count = await db.project.count({
    where: {
      id: translationId,
      userId: session?.user.id,
    },
  })

  return count > 0
}
