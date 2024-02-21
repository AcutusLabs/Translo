import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { TranslationCreateButton } from "@/components/translation-create-button"
import { TranslationItem } from "@/components/translation-item"

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Translations"
        text="Create and manage translations."
      >
        <TranslationCreateButton />
      </DashboardHeader>
      <div className="divide-border-200 divide-y rounded-md border">
        <TranslationItem.Skeleton />
        <TranslationItem.Skeleton />
        <TranslationItem.Skeleton />
        <TranslationItem.Skeleton />
        <TranslationItem.Skeleton />
      </div>
    </DashboardShell>
  )
}
