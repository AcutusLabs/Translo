import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { TranslationCreateButton } from "@/components/translation-create-button"
import { TranslationItem } from "@/components/translation-item"

export const metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const translations = await db.translation.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      title: true,
      published: true,
      createdAt: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  })

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Translations"
        text="Create and manage translations."
      >
        <TranslationCreateButton />
      </DashboardHeader>
      <div>
        {translations?.length ? (
          <div className="divide-y divide-border rounded-md border">
            {translations.map((translation) => (
              <TranslationItem key={translation.id} translation={translation} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="translation" />
            <EmptyPlaceholder.Title>
              No translations created
            </EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any translations yet. Start creating content.
            </EmptyPlaceholder.Description>
            <TranslationCreateButton variant="outline" />
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  )
}
