import { notFound, redirect } from "next/navigation"
import { Translation, User } from "@prisma/client"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { Editor } from "@/components/editor"

async function getTranslationForUser(
  translationId: Translation["id"],
  userId: User["id"]
) {
  return await db.translation.findFirst({
    where: {
      id: translationId,
      userId,
    },
  })
}

interface EditorPageProps {
  params: { translationId: string }
}

export default async function EditorPage({ params }: EditorPageProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const translation = await getTranslationForUser(params.translationId, user.id)

  if (!translation) {
    notFound()
  }

  return (
    <Editor
      translation={{
        id: translation.id,
        title: translation.title,
        content: translation.content,
        published: translation.published,
      }}
    />
  )
}
