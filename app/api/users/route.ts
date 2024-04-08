import { freePlanTokens } from "@/constants/subscriptions"
import { z } from "zod"

import { env } from "@/env.mjs"
import { db } from "@/lib/db"
import sendEmail from "@/lib/mail"
import emailVerification from "@/lib/mail/templates/emailVerification"
import { generateEmailVerificationToken, hashPassword } from "@/lib/utils"

const userCreateSchema = z.object({
  email: z.string(),
  password: z.string(),
})

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const body = userCreateSchema.parse(json)

    const token = generateEmailVerificationToken()

    const user = await db.user.create({
      data: {
        email: body.email,
        password: hashPassword(body.password),
        emailVerificationToken: token,
        tokens: freePlanTokens,
      },
      select: {
        id: true,
      },
    })

    await sendEmail({
      to: body.email,
      email: emailVerification({
        url: `${
          env.NEXT_PUBLIC_APP_URL
        }/email-verify?email=${encodeURIComponent(body.email)}&token=${token}`,
      }),
    })

    return new Response(JSON.stringify(user))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(error.message, { status: 500 })
  }
}
