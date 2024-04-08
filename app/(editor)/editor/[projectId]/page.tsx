import { notFound, redirect } from "next/navigation"
import { Project, User } from "@prisma/client"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { Editor } from "@/components/app/project"
import { getTokensByUserId } from "@/app/(dashboard)/dashboard/billing/page"

async function getProjectForUser(projectId: Project["id"], userId: User["id"]) {
  return await db.project.findFirst({
    where: {
      id: projectId,
      userId,
    },
  })
}

interface EditorPageProps {
  params: { projectId: string }
}

export default async function EditorPage({ params }: EditorPageProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const tokens = await getTokensByUserId(user.id)

  const project = await getProjectForUser(params.projectId, user.id)

  if (!project) {
    notFound()
  }

  return (
    <Editor
      project={{
        id: project.id,
        title: project.title,
        languages: project.languages,
        info: project.info,
        settings: project.settings,
        published: project.published,
      }}
      tokens={tokens}
    />
  )
}
