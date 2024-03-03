import { z } from "zod"

import { db } from "@/lib/db"
import {
  ErrorResponse,
  GenericErrorResponse,
  SuccessResponse,
} from "@/lib/response"

const changePasswordSchema = z.object({
  token: z.string(),
  oldEmail: z.string(),
  newEmail: z.string(),
})

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const body = changePasswordSchema.parse(json)

    const result = await db.user.updateMany({
      where: {
        AND: [
          {
            email: {
              contains: body.oldEmail,
            },
          },
          {
            emailVerificationToken: {
              contains: body.token,
            },
          },
        ],
      },
      data: {
        email: body.newEmail,
        emailVerificationToken: null,
      },
    })

    if (!result.count) {
      return ErrorResponse("The token does not match. Please try again.")
    }

    return SuccessResponse()
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return GenericErrorResponse()
  }
}
