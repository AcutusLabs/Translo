import i18n from "@/lib/i18n"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { TranslationCreateButton } from "@/components/translation-create-button"
import { TranslationItem } from "@/components/translation-item"

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading={i18n.t("app.dashboard.Projects")}
        text={i18n.t("app.dashboard.Create manage projects")}
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
