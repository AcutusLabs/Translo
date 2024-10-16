import Link from "next/link"
import { Project } from "@prisma/client"

import { navigate } from "@/lib/link"
import { formatDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { ProjectOperations } from "@/components/app/dashboard/projects/project-operations"

interface ProjectItemProps {
  project: Pick<Project, "id" | "title" | "published" | "createdAt">
}

export function ProjectItem({ project }: ProjectItemProps) {
  return (
    <Link
      href={navigate().project(project.id)}
      className="font-semibold hover:underline"
    >
      <div className="flex items-center justify-between p-4">
        <div className="grid gap-1">
          {project.title}
          <div>
            <p className="text-sm text-muted-foreground">
              {formatDate(project.createdAt?.toDateString())}
            </p>
          </div>
        </div>
        <ProjectOperations project={{ id: project.id, title: project.title }} />
      </div>
    </Link>
  )
}

ProjectItem.Skeleton = function TranslationItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}
