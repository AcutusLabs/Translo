import { AlertType } from "@/types/api"
import {
  BAD_REQUEST_STATUS,
  INTERNAL_SERVER_ERROR_STATUS,
} from "@/app/[lang]/api/status"

export type ErrorResponseParams = {
  error: string
  description?: string
  alertType?: AlertType
}

export const ErrorResponse = (
  params: ErrorResponseParams & { status?: number }
) =>
  new Response(
    JSON.stringify({
      error: params.error,
      description: params.description,
      alertType: params.alertType,
    }),
    { status: params.status || BAD_REQUEST_STATUS }
  )

export const GenericErrorResponse = (error: any) => {
  // eslint-disable-next-line no-console
  console.error(error)
  return new Response(JSON.stringify({ error: "Generic error" }), {
    status: INTERNAL_SERVER_ERROR_STATUS,
  })
}

export const SuccessResponse = (status = 200) =>
  new Response(JSON.stringify({}), { status })
