import { initialI18nState } from "@/store/useI18nState"
import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { MAX_PROJECTS_STARTER_URSER } from "@/lib/constants"
import { db } from "@/lib/db"
import i18n from "@/lib/i18n"
import { ErrorResponse, GenericErrorResponse } from "@/lib/response"
import { getUserSubscriptionPlan } from "@/lib/subscription"

const projectCreateSchema = z.object({
  title: z.string(),
  languages: z.string().optional(),
  info: z.string().optional(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
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
    return GenericErrorResponse(error)
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const { user } = session
    const subscriptionPlan = await getUserSubscriptionPlan(user.id)

    // If user is on a free plan.
    // Check if user has reached limit of 1 project.
    if (!subscriptionPlan?.isPro) {
      const count = await db.project.count({
        where: {
          userId: user.id,
        },
      })

      if (count >= 1) {
        return ErrorResponse({
          error: i18n.t("Limit of {number} projects reached.", {
            number: MAX_PROJECTS_STARTER_URSER,
          }),
          description: i18n.t("Please upgrade to the PRO plan."),
        })
      }
    }

    const json = await req.json()
    const body = projectCreateSchema.parse(json)

    const project = await db.project.create({
      data: {
        ...initialI18nState,
        title: body.title,
        userId: session.user.id,
      },
      select: {
        id: true,
      },
    })

    return new Response(JSON.stringify(project))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return GenericErrorResponse(error)
  }
}
