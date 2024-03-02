import nodemailer from "nodemailer"

import { env } from "@/env.mjs"
import { siteConfig } from "@/config/site"

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

type SendEmailParams = {
  to: string
  email: EmailTemplate
}

const sendEmail = async (params: SendEmailParams) => {
  const mailOptions = {
    from: `${siteConfig.name} <${env.MAIL_SMTP_FROM}>`,
    to: params.to,
    ...params.email,
  }

  await transporter.sendMail(mailOptions)
}

export default sendEmail
