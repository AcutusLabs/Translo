import * as z from "zod"

export const projectPatchSchema = z.object({
  title: z.string().optional(),
  languages: z.any().optional(),
  info: z.any().optional(),
  settings: z.any().optional(),
  published: z.any().optional(),
})
