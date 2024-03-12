import * as z from "zod"

export const projectPatchSchema = z.object({
  title: z.string().min(3).max(128).optional(),
  languages: z.any().optional(),
  info: z.any().optional(),
  settings: z.any().optional(),
  published: z.any().optional(),
})
