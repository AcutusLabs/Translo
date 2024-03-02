"use server"

import { db } from "@/lib/db"
import { hashPassword } from "@/lib/utils"

export const findUserByEmail = async (email: string) => {
  return await db.user.findFirst({
    where: {
      email,
    },
  })
}

export const verifyEmail = (email: string) => {
  return db.user.update({
    where: { email },
    data: {
      emailVerified: new Date(),
      emailVerificationToken: null,
    },
  })
}

type ChangePassword = {
  old: string
  new: string
}
export const changePassword = async (
  id: string,
  changePassword: ChangePassword
) => {
  return db.user.updateMany({
    where: {
      id,
      password: hashPassword(changePassword.old),
    },
    data: {
      password: hashPassword(changePassword.new),
    },
  })
}
