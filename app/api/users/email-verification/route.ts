import { z } from "zod"

import { db } from "@/lib/db"
import { handleCatchApi } from "@/lib/exceptions"
import i18n from "@/lib/i18n"
import { ErrorResponse, SuccessResponse } from "@/lib/response"

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
      return ErrorResponse({
        error: i18n.t("The token does not match. Please try again."),
      })
    }

    return SuccessResponse()
  } catch (error) {
    return handleCatchApi(error)
  }
}
