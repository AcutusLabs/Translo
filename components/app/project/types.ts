import { Project } from "@prisma/client"

export type ProjectData = Pick<
  Project,
  "id" | "title" | "languages" | "published" | "info" | "settings"
>
