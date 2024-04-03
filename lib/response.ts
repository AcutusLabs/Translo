import { AlertType } from "@/types/api"

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
    { status: params.status || 400 }
  )

export const GenericErrorResponse = (error: any) => {
  // eslint-disable-next-line no-console
  console.error(error)
  return new Response(JSON.stringify({ error: "Generic error" }), {
    status: 500,
  })
}

export const SuccessResponse = (status = 200) =>
  new Response(JSON.stringify({}), { status })
