import { getServerSession } from "next-auth"
import * as z from "zod"

import { AlertType } from "@/types/api"
import { authOptions } from "@/lib/auth"
import { MAX_KEYWORDS_STARTER_URSER } from "@/lib/constants"
import { db } from "@/lib/db"
import { handleCatchApi } from "@/lib/exceptions"
import i18n from "@/lib/i18n"
import { ErrorResponse, SuccessResponse } from "@/lib/response"
import { isUserPro } from "@/lib/subscription"
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
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate route params.
    const { params } = routeContextSchema.parse(context)

    // Check if the user has access to this project.
    if (!(await verifyCurrentUserHasAccessToProject(params.projectId))) {
      return ErrorResponse({ error: i18n.t("Wrong user"), status: 403 })
    }

    // Get the request body and validate it.
    const json = await req.json()
    const body = projectPatchSchema.parse(json)

    const isPro = await isUserPro()

    if (!isPro && body.languages) {
      if (
        Object.keys(body.languages[0].keywords).length >
        MAX_KEYWORDS_STARTER_URSER
      ) {
        return ErrorResponse({
          error: i18n.t("Limit of {number} keywords reached.", {
            number: MAX_KEYWORDS_STARTER_URSER,
          }),
          description: i18n.t("Please upgrade to the PRO plan."),
          status: 403,
          alertType: AlertType.keywordsSubscriptionNeeded,
        })
      }
    }

    const newData: typeof body = {
      title: body.title,
      languages: body.languages,
      info: body.info,
      settings: body.settings,
    }

    if (body.published !== undefined) {
      newData.published = body.published
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

export async function verifyCurrentUserHasAccessToProject(projectId: string) {
  const session = await getServerSession(authOptions)
  const count = await db.project.count({
    where: {
      id: projectId,
      userId: session?.user.id,
    },
  })

  return count > 0
}
