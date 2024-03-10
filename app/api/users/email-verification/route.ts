import { z } from "zod"

import { db } from "@/lib/db"
import {
  ErrorResponse,
  GenericErrorResponse,
  SuccessResponse,
} from "@/lib/response"

const emailVerificationSchema = z.object({
  token: z.string(),
  email: z.string(),
})

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const body = emailVerificationSchema.parse(json)

    const result = await db.user.updateMany({
      where: {
        AND: [
          {
            email: {
              contains: body.email,
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
        emailVerificationToken: null,
        emailVerified: new Date(),
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
