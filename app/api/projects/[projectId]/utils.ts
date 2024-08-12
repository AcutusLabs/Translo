import { getServerSession } from "next-auth"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export const projectPatchSchema = z.object({
  title: z.string().optional(),
  settings: z.any().optional(),
})

export const routeContextSchemaProject = z.object({
  params: z.object({
    projectId: z.string(),
  }),
})

export async function verifyCurrentUserHasAccessToProject(projectId: string) {
  const session = await getServerSession(authOptions)
  const count = await db.project.count({
    where: {
      id: projectId,
      userId: session?.user.id,
    },
  })

  return count > 0
}
