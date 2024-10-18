import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/auth"
import { handleCatchApi } from "@/lib/exceptions"

import { LOGOUT_STATUS } from "../../status"
import { getTokensByUserId } from "../utils"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: LOGOUT_STATUS })
    }

    const { user } = session
    const tokens = await getTokensByUserId(user.id)

    return new Response(JSON.stringify(tokens))
  } catch (error) {
    return handleCatchApi(error)
  }
}
