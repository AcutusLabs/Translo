"use server"

import { env } from "@/env.mjs"
import { db } from "@/lib/db"
import sendEmail from "@/lib/mail"
import emailChangeEmail from "@/lib/mail/templates/changeEmail"
import emailResetPassword from "@/lib/mail/templates/resetPassword"
import { generateEmailVerificationToken } from "@/lib/utils"

export const findUserByEmail = async (email: string) => {
  return await db.user.findFirst({
    where: {
      email,
    },
  })
}

export const forgotPassword = async (email: string) => {
  const token = generateEmailVerificationToken()

  const result = await db.user.updateMany({
    where: { email },
    data: {
      emailVerificationToken: token,
    },
  })

  if (!result.count) {
    throw "error during creating token"
  }

  await sendEmail({
    to: email,
    email: emailResetPassword({
      url: `${
        env.NEXT_PUBLIC_APP_URL
      }/reset-password?email=${encodeURIComponent(email)}&token=${token}`,
    }),
  })
}

export const changeEmail = async (oldEmail: string, newEmail: string) => {
  const token = generateEmailVerificationToken()

  try {
    await db.user.update({
      where: { email: oldEmail },
      data: {
        emailVerificationToken: token,
      },
    })

    await sendEmail({
      to: newEmail,
      email: emailChangeEmail({
        url: `${
          env.NEXT_PUBLIC_APP_URL
        }/change-email?token=${token}&oldEmail=${encodeURIComponent(
          oldEmail
        )}&newEmail=${encodeURIComponent(newEmail)}`,
      }),
    })
  } catch (e) {
    throw e
  }
}
