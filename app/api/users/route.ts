import { randomBytes } from "crypto"
import { z } from "zod"

import { env } from "@/env.mjs"
import { db } from "@/lib/db"
import sendEmail from "@/lib/mail"
import emailVerification from "@/lib/mail/templates/emailVerification"
import { hashPassword } from "@/lib/utils"

const userCreateSchema = z.object({
  email: z.string(),
  password: z.string(),
})

const generateEmailVerificationToken = () => {
  // generates a buffer containing 32 random bytes.
  // The 32 indicates the number of bytes to generate, and it is commonly used
  // for creating secure tokens or identifiers.
  return randomBytes(32).toString("hex")
}

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
      },
      select: {
        id: true,
      },
    })

    await sendEmail({
      to: body.email,
      email: emailVerification({
        url: `${env.NEXT_PUBLIC_APP_URL}/email-verify?email=${body.email}&token=${token}`,
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
