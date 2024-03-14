import { getServerSession } from "next-auth"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import {
  ErrorResponse,
  GenericErrorResponse,
  SuccessResponse,
} from "@/lib/response"
import { hashPassword } from "@/lib/utils"

const changePasswordSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string(),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    const json = await req.json()
    const body = changePasswordSchema.parse(json)

    const result = await db.user.updateMany({
      where: {
        AND: [
          {
            id: {
              contains: session?.user.id,
            },
          },
          {
            password: {
              contains: hashPassword(body.oldPassword),
            },
          },
        ],
      },
      data: {
        password: hashPassword(body.newPassword),
      },
    })

    if (!result.count) {
      return ErrorResponse({
        error: "The password does not match. Please try again.",
      })
    }

    return SuccessResponse()
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return GenericErrorResponse(error)
  }
}
