import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import i18n from "@/lib/i18n"
import { getCurrentUser } from "@/lib/session"
import AddNewProject from "@/components/app/dashboard/dialogs/add-new-project"
import { ProjectItem } from "@/components/app/dashboard/projects/project-item"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

export const metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const projects = await db.project.findMany({
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
        heading={i18n.t("Projects")}
        text={i18n.t("Create manage projects")}
      >
        <AddNewProject />
      </DashboardHeader>
      <div>
        {projects?.length ? (
          <div className="divide-y divide-border rounded-md border">
            {projects.map((project) => (
              <ProjectItem key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="project" />
            <EmptyPlaceholder.Title>
              {i18n.t("No project added")}
            </EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              {i18n.t("dashboard.No project added.description")}
            </EmptyPlaceholder.Description>
            <AddNewProject />
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  )
}
