import { getServerSession } from "next-auth/next"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { handleCatchApi } from "@/lib/exceptions"
import i18n from "@/lib/i18n"
import { ErrorResponse, SuccessResponse } from "@/lib/response"
import { userNameSchema } from "@/lib/validations/user"

import { LOGOUT_STATUS } from "../../status"

const routeContextSchema = z.object({
  params: z.promise(
    z.object({
      userId: z.string(),
    })
  ),
})

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const params = await routeContextSchema.parse(context).params

    // Ensure user is authentication and has access to this user.
    const session = await getServerSession(authOptions)
    if (!session?.user || params.userId !== session?.user.id) {
      return ErrorResponse({
        error: i18n.t("Wrong user"),
        status: LOGOUT_STATUS,
      })
    }

    // Get the request body and validate it.
    const body = await req.json()
    const payload = userNameSchema.parse(body)

    // Update the user.
    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: payload.name,
        lang: payload.lang,
      },
    })

    return SuccessResponse()
  } catch (error) {
    return handleCatchApi(error)
  }
}
