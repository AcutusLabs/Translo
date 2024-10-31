import { freePlanTokens } from "@/constants/subscriptions"
import sha256 from "crypto-js/sha256"
import { z } from "zod"

import { env } from "@/env.mjs"
import { proPlanMonthly } from "@/config/subscriptions"
import { db } from "@/lib/db"
import i18n from "@/lib/i18n"
import sendEmail from "@/lib/mail"
import emailVerification from "@/lib/mail/templates/emailVerification"
import { ErrorResponse } from "@/lib/response"
import { generateEmailVerificationToken, hashPassword } from "@/lib/utils"

import { INTERNAL_SERVER_ERROR_STATUS, TYPE_ERROR_STATUS } from "../status"
import { findUserByEmail } from "./utils"

const userCreateSchema = z.object({
  email: z.string(),
  password: z.string(),
  lang: z.string().optional(),
  skip_activation: z.boolean().optional(),
  add_fake_subscription: z.boolean().optional(),
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
        lang: body.lang || "en",
        emailVerified:
          env.TEST_MODE_ENABLED === "true" && body.skip_activation
            ? new Date()
            : null,
        ...(body.add_fake_subscription && env.TEST_MODE_ENABLED === "true"
          ? {
              stripeCustomerId: sha256(body.email).toString(),
              stripeSubscriptionId: sha256(body.email).toString(),
              stripePriceId: proPlanMonthly.stripePriceId,
              stripeCurrentPeriodEnd: new Date(Date.now() + 86_400_000),
            }
          : {}),
      },
      update: {
        email: body.email,
        password: hashPassword(body.password),
        emailVerificationToken: token,
        tokens: BigInt(freePlanTokens),
      },
    })

    if (env.TEST_MODE_ENABLED === "true" && body.skip_activation) {
      // skip email verification
    } else {
      await sendEmail({
        to: body.email,
        email: emailVerification({
          url: `${
            env.NEXT_PUBLIC_APP_URL
          }/email-verify?email=${encodeURIComponent(body.email)}&token=${token}`,
        }),
      })
    }

    return new Response(JSON.stringify(user))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), {
        status: TYPE_ERROR_STATUS,
      })
    }

    return new Response(error.message, { status: INTERNAL_SERVER_ERROR_STATUS })
  }
}
