"use client"

import * as React from "react"
import Link from "next/link"

import "@/styles/editor.css"

import { useContext, useMemo, useState } from "react"
import { debounce } from "lodash"
import { createPortal } from "react-dom"

import { env } from "@/env.mjs"
import i18n from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { useEditProject } from "@/hooks/api/project/use-edit-project"
import { SemaphoreTranslation } from "@/hooks/api/project/use-translate-project"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { AlertContext } from "@/app/[lang]/client-providers"

import { DownloadKeywordsDropdownMenu } from "./dialogs/download"
import ImportKeywordsModal from "./dialogs/import-keywords"
import { TranslateAllKeywords } from "./dialogs/translate-all-project"
import TranslateAllModal from "./modals/translate-all"
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
  const [currentKeywordInTranlsateAll, setCurrentKeywordInTranslateAll] =
    useState("")
  const [progress, setProgress] = useState<number | undefined>(undefined)

  const alertContext = useContext(AlertContext)

  const { mutate: save } = useEditProject({
    projectId: project.id,
    projectProps: {
      title,
    },
    showAlertType: alertContext.showAlert,
  })

  const debounceSaveData = useMemo(() => debounce(save, 1000), [save])

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
            projectId={project.id}
            keywords={project.keywords}
            languages={project.languages}
          />
          {env.NEXT_PUBLIC_TRANSLATE_ALL_PROJECT_ENABLED === "true" && (
            <TranslateAllKeywords
              projectId={project.id}
              languages={project.languages}
              keywords={project.keywords}
              tokens={tokens}
              setProgress={setProgress}
              setCurrentKeywordInTranslateAll={setCurrentKeywordInTranslateAll}
            />
          )}
          <button
            onClick={() => openProjectSettings(true)}
            className={cn(buttonVariants({ variant: "secondary" }), "mr-4")}
          >
            <span>{i18n.t("Settings")}</span>
          </button>
        </div>
        {progress !== undefined &&
          createPortal(
            <TranslateAllModal
              progress={progress}
              cancel={() => {
                SemaphoreTranslation.stopped = true
                setProgress(undefined)
              }}
              keywordInTranslation={currentKeywordInTranlsateAll}
            />,
            window.document.body
          )}
      </div>
      <div className="prose prose-stone mx-auto w-full max-w-[1000px] dark:prose-invert">
        <input
          id="title"
          placeholder={i18n.t("Project name")}
          className="height-[288px] font-bold text-5xl bg-transparent w-full outline-none mb-10 mt-5"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            debounceSaveData()
          }}
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
