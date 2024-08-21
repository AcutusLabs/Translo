import { getServerSession } from "next-auth/next"
import * as z from "zod"

import {
  UserDoAction,
  eventUserDo,
  sendServerPostHogEvent,
} from "@/lib/analytics-server"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { handleCatchApi } from "@/lib/exceptions"
import i18n from "@/lib/i18n"
import { ErrorResponse } from "@/lib/response"
import { LOGOUT_STATUS, NOT_ALLOWED_STATUS } from "@/app/api/status"

import {
  routeContextSchemaProject,
  verifyCurrentUserHasAccessToProject,
} from "../utils"

const languageCreateSchema = z.object({
  short: z.string().nonempty(),
  name: z.string().nonempty(),
})

const getAllLanguagesByProject = async (projectId: string) => {
  const languages = await db.projectLanguage.findMany({
    select: {
      id: true,
      name: true,
      short: true,
      projectId: true,
    },
    where: {
      projectId: projectId,
    },
  })
  return languages
}

export async function GET(
  _req: Request,
  context: z.infer<typeof routeContextSchemaProject>
) {
  try {
    const { params } = routeContextSchemaProject.parse(context)

    if (!(await verifyCurrentUserHasAccessToProject(params.projectId))) {
      return ErrorResponse({
        error: i18n.t("Wrong user"),
        status: NOT_ALLOWED_STATUS,
      })
    }

    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: LOGOUT_STATUS })
    }

    const result = await getAllLanguagesByProject(params.projectId)
    return new Response(JSON.stringify(result))
  } catch (error) {
    return handleCatchApi(error)
  }
}

export async function POST(
  req: Request,
  context: z.infer<typeof routeContextSchemaProject>
) {
  try {
    const { params } = routeContextSchemaProject.parse(context)

    if (!(await verifyCurrentUserHasAccessToProject(params.projectId))) {
      return ErrorResponse({
        error: i18n.t("Wrong user"),
        status: NOT_ALLOWED_STATUS,
      })
    }

    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: LOGOUT_STATUS })
    }

    const { user } = session

    sendServerPostHogEvent((client) => {
      eventUserDo(user.id, client, UserDoAction.addLanguage)
    })

    const json = await req.json()
    const body = languageCreateSchema.parse(json)

    await db.projectLanguage.create({
      data: {
        name: body.name,
        short: body.short,
        projectId: params.projectId,
      },
      select: {
        id: true,
      },
    })

    const result = getAllLanguagesByProject(params.projectId)

    return new Response(JSON.stringify(result))
  } catch (error) {
    return handleCatchApi(error)
  }
}
