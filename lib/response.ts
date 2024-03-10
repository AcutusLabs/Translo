export const ErrorResponse = (error: string, status = 400) =>
  new Response(JSON.stringify({ error }), { status })

export const GenericErrorResponse = () =>
  new Response(JSON.stringify({ error: "Generic error" }), { status: 500 })

export const SuccessResponse = (status = 200) =>
  new Response(JSON.stringify({}), { status })
