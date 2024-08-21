import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { AlertType } from "@/types/api"
import {
  UserDoAction,
  eventUserDo,
  sendServerPostHogEvent,
} from "@/lib/analytics-server"
import { authOptions } from "@/lib/auth"
import { MAX_PROJECTS_STARTER_URSER } from "@/lib/constants"
import { db } from "@/lib/db"
import { handleCatchApi } from "@/lib/exceptions"
import i18n from "@/lib/i18n"
import { ErrorResponse } from "@/lib/response"
import { getUserSubscriptionPlan } from "@/lib/subscription"

import { LOGOUT_STATUS } from "../status"

const projectCreateSchema = z.object({
  title: z.string(),
  languages: z.string().optional(),
  info: z.string().optional(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: LOGOUT_STATUS })
    }

    const { user } = session
    const projects = await db.project.findMany({
      select: {
        id: true,
        title: true,
        published: true,
        createdAt: true,
      },
      where: {
        userId: user.id,
      },
    })

    return new Response(JSON.stringify(projects))
  } catch (error) {
    return handleCatchApi(error)
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: LOGOUT_STATUS })
    }

    const { user } = session
    const subscriptionPlan = await getUserSubscriptionPlan(user.id)

    sendServerPostHogEvent((client) => {
      eventUserDo(user.id, client, UserDoAction.createProject)
    })

    // If user is on a free plan.
    // Check if user has reached limit of 1 project.
    if (!subscriptionPlan?.isPro) {
      const count = await db.project.count({
        where: {
          userId: user.id,
        },
      })

      if (count >= MAX_PROJECTS_STARTER_URSER) {
        return ErrorResponse({
          error: i18n.t("Limit of {number} projects reached.", {
            number: MAX_PROJECTS_STARTER_URSER,
          }),
          description: i18n.t("Please upgrade to the PRO plan."),
          alertType: AlertType.projectSubscriptionNeeded,
        })
      }
    }

    const json = await req.json()
    const body = projectCreateSchema.parse(json)

    const project = await db.project.create({
      data: {
        title: body.title,
        settings: {},
        published: false,
        userId: session.user.id,
      },
      select: {
        id: true,
      },
    })

    await db.projectLanguage.create({
      data: {
        short: "en",
        name: "English",
        projectId: project.id,
      },
    })

    return new Response(JSON.stringify(project))
  } catch (error) {
    return handleCatchApi(error)
  }
}
