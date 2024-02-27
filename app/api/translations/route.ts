import { initialI18nState } from "@/store/useI18nState"
import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { RequiresProPlanError } from "@/lib/exceptions"
import { getUserSubscriptionPlan } from "@/lib/subscription"

const translationCreateSchema = z.object({
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
    const transactions = await db.translation.findMany({
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

    return new Response(JSON.stringify(transactions))
  } catch (error) {
    return new Response(null, { status: 500 })
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
    // Check if user has reached limit of 1 translation.
    if (!subscriptionPlan?.isPro) {
      const count = await db.translation.count({
        where: {
          userId: user.id,
        },
      })

      if (count >= 1) {
        throw new RequiresProPlanError()
      }
    }

    const json = await req.json()
    const body = translationCreateSchema.parse(json)

    const translation = await db.translation.create({
      data: {
        ...initialI18nState,
        title: body.title,
        userId: session.user.id,
      },
      select: {
        id: true,
      },
    })

    return new Response(JSON.stringify(translation))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    if (error instanceof RequiresProPlanError) {
      return new Response("Requires Pro Plan", { status: 402 })
    }

    return new Response(null, { status: 500 })
  }
}
