import { z } from "zod"

export const routeContextSchemaProjectKeyword = z.object({
  params: z.promise(
    z.object({
      projectId: z.string(),
      keywordId: z.string(),
    })
  ),
})
