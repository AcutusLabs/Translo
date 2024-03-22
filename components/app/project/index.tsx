"use client"

import * as React from "react"
import Link from "next/link"

import "@/styles/editor.css"
import { useMemo, useState } from "react"

import i18n from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

import { DownloadKeywordsDropdownMenu } from "./dialogs/download"
import ImportKeywordsModal from "./dialogs/import-keywords"
import ProjectSettingsSlideOver from "./settings-slide-over"
import Table from "./table/table"
import { ProjectData } from "./types"
import useTranslation, { Status } from "./useTranslation"

export interface EditorProps {
  project: ProjectData
}

export function Editor(props: EditorProps) {
  const { project } = props

  const {
    keywords,
    status,
    title,
    languages,
    settings,
    addNewKey,
    deleteKey,
    editTranslation,
    setTitle,
    editContext,
    editKey,
    addLanguage,
    editLanguage,
    deleteLanguage,
    editSettings,
    addNewTerm,
    checkIfKeyAlreadyExists,
    importKeys,
    download,
    publishProject,
    isPublished,
    i18nLanguages,
  } = useTranslation(props)

  const [isProjectSettingsOpened, openProjectSettings] =
    useState<boolean>(false)

  const renderStatus = useMemo(() => {
    switch (status) {
      case Status.ToSave:
        return (
          <div className="flex items-center space-x-2">
            <span>{i18n.t("Waiting...")}</span>
          </div>
        )
      case Status.Saving:
        return (
          <div className="flex items-center space-x-2">
            <Icons.spinner className="animate-spin h-4 w-4" />
            <span>{i18n.t("Saving...")}</span>
          </div>
        )
      case Status.Saved:
        return (
          <div className="flex items-center space-x-2 text-green-500">
            <Icons.check className="h-4 w-4" />
            <span>{i18n.t("Saved")}</span>
          </div>
        )
    }
  }, [status])

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
            languages={languages.map((language) => language.short)}
            isPublished={isPublished}
            publishProject={publishProject}
            download={download}
          />
          <ImportKeywordsModal
            keywords={keywords}
            languages={i18nLanguages}
            importKeys={importKeys}
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
        {/** icon plus label to say if the object is saved */}
        <div className="flex items-center justify-left my-1">
          {renderStatus}
        </div>
        <Table
          keywords={keywords}
          addKeyword={addNewKey}
          deleteKey={deleteKey}
          editTranslation={editTranslation}
          editContext={editContext}
          editKey={editKey}
          checkIfKeyAlreadyExists={checkIfKeyAlreadyExists}
          project={project}
          languages={languages}
          addLanguage={addLanguage}
        />
      </div>
      {isProjectSettingsOpened && (
        <ProjectSettingsSlideOver
          languages={languages}
          settings={settings}
          addLanguage={addLanguage}
          editLanguage={editLanguage}
          deleteLanguage={deleteLanguage}
          onClose={() => openProjectSettings(false)}
          editSettings={editSettings}
          addNewTerm={addNewTerm}
        />
      )}
    </div>
  )
}
