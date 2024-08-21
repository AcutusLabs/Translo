import { signOut } from "next-auth/react"
import { z } from "zod"

import { ShowAlertType } from "@/types/api"
import { toast } from "@/components/ui/use-toast"
import { LOGOUT_STATUS, TYPE_ERROR_STATUS } from "@/app/api/status"

import i18n from "./i18n"
import { ErrorResponseParams, GenericErrorResponse } from "./response"

export const handleApiError = (error: any, showAlertType?: ShowAlertType) => {
  if (error.response.status === LOGOUT_STATUS) {
    toast({
      title: i18n.t("Something went wrong"),
      description: i18n.t("The session has expired"),
      variant: "destructive",
    })
    signOut({
      callbackUrl: `${window.location.origin}/login`,
    })
    return
  }

  const errorResponse: ErrorResponseParams = error.response
    .data as ErrorResponseParams

  if (errorResponse.alertType && showAlertType) {
    showAlertType(errorResponse.alertType)
  } else if (errorResponse.description) {
    toast({
      title: errorResponse.error,
      description: errorResponse.description,
      variant: "destructive",
    })
  } else {
    toast({
      title: i18n.t("Something went wrong"),
      description: errorResponse.error,
      variant: "destructive",
    })
  }
}

export class Unauthorized extends Error {
  constructor(message = "Unauthorized") {
    super(message)
  }
}

export const handleCatchApi = (error: Error) => {
  if (error instanceof z.ZodError) {
    return new Response(JSON.stringify(error.issues), {
      status: TYPE_ERROR_STATUS,
    })
  }

  if (error instanceof Unauthorized) {
    return new Response("Unauthorized", { status: LOGOUT_STATUS })
  }

  return GenericErrorResponse(error)
}
