import { toast } from "@/components/ui/use-toast"

import { ErrorResponseParams } from "./response"

export const handleApiError = (error: any) => {
  const errorResponse: ErrorResponseParams = error.response
    .data as ErrorResponseParams

  if (errorResponse.description) {
    toast({
      title: errorResponse.error,
      description: errorResponse.description,
      variant: "destructive",
    })
  } else {
    toast({
      title: "Something went wrong.",
      description: errorResponse.error,
      variant: "destructive",
    })
  }
}
