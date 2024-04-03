import { env } from "@/env.mjs"
import { toast } from "@/components/ui/use-toast"

import i18n from "./i18n"

export enum HTTP_POST_PATH {
  changePassword = "/users/change-password",
  resetPassword = "/users/reset-password",

  emailVerification = "/users/email-verification",
  changeEmail = "/users/change-email",
}

export const HTTP_POST = async (path: HTTP_POST_PATH, body: string) => {
  const myHeaders = new Headers()
  myHeaders.append("Content-Type", "application/json")

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body,
  }

  const response = await fetch(
    `${env.NEXT_PUBLIC_APP_URL}/api${path}`,
    requestOptions
  )

  const json = await response.json()
  checkResposne(response.status, json)

  return json
}

const checkResposne = (status: number, json: any) => {
  if (status === 400 && json["error"]) {
    toast({
      title: i18n.t("Something went wrong"),
      description: json["error"],
      variant: "destructive",
    })
    throw json["error"]
  }
}
