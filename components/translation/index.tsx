"use client"

import * as React from "react"
import Link from "next/link"
import { Translation } from "@prisma/client"

import "@/styles/editor.css"
import { useState } from "react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

import ProjectSettingsSlideOver from "./settings-slide-over"
import Table from "./table/table"
import useTranslation from "./useTranslation"

export interface EditorProps {
  translation: Pick<
    Translation,
    "id" | "title" | "languages" | "published" | "info"
  >
}

export function Editor(props: EditorProps) {
  const { keywords, isSaving, save, addNewKey, deleteKey, editTranslation } =
    useTranslation(props)

  const [isProjectSettingsOpened, openProjectSettings] =
    useState<boolean>(false)

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
              Back
            </>
          </Link>
        </div>
        <div>
          <button
            onClick={() => openProjectSettings(true)}
            className={cn(buttonVariants({ variant: "secondary" }), "mr-4")}
          >
            <span>Settings</span>
          </button>
          <button onClick={save} className={cn(buttonVariants())}>
            {isSaving && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>Save</span>
          </button>
        </div>
      </div>
      <div className="prose prose-stone mx-auto w-full max-w-[1000px] dark:prose-invert">
        <input
          id="title"
          placeholder="Translation name"
          className="height-[288px] font-bold text-5xl bg-transparent w-full outline-none mb-10"
          defaultValue={props.translation.title}
        />
        <Table
          keywords={keywords}
          addKeyword={addNewKey}
          deleteKey={deleteKey}
          editTranslation={editTranslation}
          save={save}
          isSaving={isSaving}
        />
      </div>
      {isProjectSettingsOpened && (
        <ProjectSettingsSlideOver onClose={() => openProjectSettings(false)} />
      )}
    </div>
  )
}
