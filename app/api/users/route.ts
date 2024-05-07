import { freePlanTokens } from "@/constants/subscriptions"
import { z } from "zod"

import { env } from "@/env.mjs"
import { db } from "@/lib/db"
import i18n from "@/lib/i18n"
import sendEmail from "@/lib/mail"
import emailVerification from "@/lib/mail/templates/emailVerification"
import { ErrorResponse } from "@/lib/response"
import { generateEmailVerificationToken, hashPassword } from "@/lib/utils"

import { findUserByEmail } from "./utils"

const userCreateSchema = z.object({
  email: z.string(),
  password: z.string(),
})

// @ts-ignore
BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString())
  return int ?? this.toString()
}

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const body = userCreateSchema.parse(json)

    const userAlreadyExists = await findUserByEmail(body.email)

    if (userAlreadyExists?.emailVerified) {
      return ErrorResponse({
        error: i18n.t("Email already exists"),
        description: i18n.t("This email is already in use"),
      })
    }

    const token = generateEmailVerificationToken()

    const user = await db.user.upsert({
      where: {
        email: body.email,
      },
      create: {
        email: body.email,
        password: hashPassword(body.password),
        emailVerificationToken: token,
        tokens: BigInt(freePlanTokens),
      },
      update: {
        email: body.email,
        password: hashPassword(body.password),
        emailVerificationToken: token,
        tokens: BigInt(freePlanTokens),
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
