import nodemailer from "nodemailer"

import { env } from "@/env.mjs"

import { EmailTemplate } from "./types"

const transporter = nodemailer.createTransport(
  {
    host: env.MAIL_SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
      user: env.MAIL_SMTP_USER,
      pass: env.MAIL_SMTP_PASSWORD,
    },
    normalizeHeaderKey: (key) => key.toUpperCase(),
  },
  {
    headers: {
      // Set this to prevent Gmail from threading emails.
      // See https://stackoverflow.com/questions/23434110/force-emails-not-to-be-grouped-into-conversations/25435722.
      "X-Entity-Ref-ID": new Date().getTime() + "",
    },
  }
)

const sendEmail = async (from: string, to: string, detail: EmailTemplate) => {
  const mailOptions = {
    from,
    to,
    ...detail,
  }

  await transporter.sendMail(mailOptions)
}

export default sendEmail
