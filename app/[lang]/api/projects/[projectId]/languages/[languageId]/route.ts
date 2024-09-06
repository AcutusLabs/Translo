import * as z from "zod"

import { db } from "@/lib/db"
import { handleCatchApi } from "@/lib/exceptions"
import i18n from "@/lib/i18n"
import { ErrorResponse, SuccessResponse } from "@/lib/response"
import { NOT_ALLOWED_STATUS } from "@/app/[lang]/api/status"

import { verifyCurrentUserHasAccessToProject } from "../../utils"

const languagePatchSchema = z.object({
  short: z.string(),
  name: z.string(),
})

const routeContextSchemaProjectLanguage = z.object({
  params: z.object({
    projectId: z.string(),
    languageId: z.string(),
  }),
})

export async function DELETE(
  _req: Request,
  context: z.infer<typeof routeContextSchemaProjectLanguage>
) {
  try {
    const { params } = routeContextSchemaProjectLanguage.parse(context)

    if (!(await verifyCurrentUserHasAccessToProject(params.projectId))) {
      return ErrorResponse({
        error: i18n.t("Wrong user"),
        status: NOT_ALLOWED_STATUS,
      })
    }

    await db.projectLanguage.delete({
      where: {
        id: params.languageId as string,
      },
    })

    return SuccessResponse()
  } catch (error) {
    return handleCatchApi(error)
  }
}

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchemaProjectLanguage>
) {
  try {
    const { params } = routeContextSchemaProjectLanguage.parse(context)

    if (!(await verifyCurrentUserHasAccessToProject(params.projectId))) {
      return ErrorResponse({
        error: i18n.t("Wrong user"),
        status: NOT_ALLOWED_STATUS,
      })
    }

    const json = await req.json()
    const body = languagePatchSchema.parse(json)

    const newData: typeof body = {
      short: body.short,
      name: body.name,
    }

    await db.projectLanguage.update({
      where: {
        id: params.languageId,
      },
      data: newData,
    })

    return SuccessResponse()
  } catch (error) {
    return handleCatchApi(error)
  }
}
