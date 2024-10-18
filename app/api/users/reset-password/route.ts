import { z } from "zod"

import { db } from "@/lib/db"
import { handleCatchApi } from "@/lib/exceptions"
import i18n from "@/lib/i18n"
import { ErrorResponse, SuccessResponse } from "@/lib/response"
import { hashPassword } from "@/lib/utils"

const resetPasswordSchema = z.object({
  email: z.string(),
  token: z.string(),
  newPassword: z.string(),
})

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const body = resetPasswordSchema.parse(json)

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
        password: hashPassword(body.newPassword),
        emailVerificationToken: null,
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
