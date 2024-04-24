"use client"

import * as React from "react"
import Link from "next/link"

import "@/styles/editor.css"
import { useState } from "react"

import i18n from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

import { DownloadKeywordsDropdownMenu } from "./dialogs/download"
import ImportKeywordsModal from "./dialogs/import-keywords"
import ProjectSettingsSlideOver from "./settings-slide-over"
import Table from "./table/table"
import { ProjectData } from "./types"
import useTranslation from "./useTranslation"

export interface EditorProps {
  project: ProjectData
  tokens: number
}

export function Editor(props: EditorProps) {
  const { download, isPublished, project, tokens } = useTranslation(props)

  const [isProjectSettingsOpened, openProjectSettings] =
    useState<boolean>(false)

  const [title, setTitle] = useState(project.title)

  return (
    <div className="w-full gap-10">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center space-x-10">
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            <>
              <Icons.chevronLeft className="mr-2 h-4 w-4" />
              {i18n.t("Back")}
            </>
          </Link>
        </div>
        <div>
          <DownloadKeywordsDropdownMenu
            id={project.id}
            languages={project.languages.map((language) => language.short)}
            isPublished={isPublished}
            download={download}
          />
          <ImportKeywordsModal
            keywords={project.keywords}
            languages={project.languages}
            importKeys={() => {
              // TODO
            }}
          />
          <button
            onClick={() => openProjectSettings(true)}
            className={cn(buttonVariants({ variant: "secondary" }), "mr-4")}
          >
            <span>{i18n.t("Settings")}</span>
          </button>
        </div>
      </div>
      <div className="prose prose-stone mx-auto w-full max-w-[1000px] dark:prose-invert">
        <input
          id="title"
          placeholder={i18n.t("Project name")}
          className="height-[288px] font-bold text-5xl bg-transparent w-full outline-none mb-10 mt-5"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Table
          tokens={tokens}
          keywords={project.keywords}
          project={project}
          languages={project.languages}
        />
      </div>
      {isProjectSettingsOpened && (
        <ProjectSettingsSlideOver
          projectId={project.id}
          languages={project.languages}
          settings={project.settings}
          onClose={() => openProjectSettings(false)}
        />
      )}
    </div>
  )
}
