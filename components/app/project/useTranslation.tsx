import { useCallback } from "react"
import FileSaver from "file-saver"
import JSZip from "jszip"
import _ from "lodash"

import { useGetKeywords } from "@/hooks/api/project/keyword/use-get-keywords"
import { useGetLanguages } from "@/hooks/api/project/language/use-get-languages"
import { useGetProject } from "@/hooks/api/project/use-get-project"
import { useGetTokens } from "@/hooks/api/user/use-get-tokens"

import { EditorProps } from "."
import { LanguageData } from "./types"

export enum DownloadFormat {
  json_files = "json_files",
}

export enum Status {
  Saved = "saved",
  ToSave = "to-save",
  Saving = "saving",
}

const useTranslation = (props: EditorProps) => {
  const { project: projectFromSSR, tokens: tokensFromSSR } = props

  const downloadFiles = useCallback(() => {
    const zip = new JSZip()

    props.project.languages.forEach((language: LanguageData) => {
      zip.file(
        `${language.short}.json`,
        JSON.stringify(language.short, null, 4)
      )
    })

    zip.generateAsync({ type: "blob" }).then(function (content) {
      FileSaver.saveAs(
        content,
        `${props.project.title.replaceAll(" ", "-")}-translations.zip`
      )
    })
  }, [props.project.title, props.project.languages])

  const download = useCallback(
    (format: DownloadFormat) => {
      switch (format) {
        case DownloadFormat.json_files:
          downloadFiles()
          break
      }
    },
    [downloadFiles]
  )

  const { data: keywordsFromApi } = useGetKeywords({
    projectId: projectFromSSR.id,
    initialData: {
      keywords: projectFromSSR.keywords,
      languages: projectFromSSR.languages,
    },
  })

  const { data: languagesFromApi } = useGetLanguages({
    projectId: projectFromSSR.id,
    initialData: projectFromSSR.languages,
  })

  const { data: projectFromApi } = useGetProject({
    projectId: projectFromSSR.id,
    initialData: projectFromSSR,
  })

  const { data: tokensFromApi } = useGetTokens({ initialData: tokensFromSSR })

  const project = {
    ...projectFromApi,
    keywords: keywordsFromApi,
    languages: languagesFromApi,
  }

  return {
    tokens: tokensFromApi,
    project,
    isPublished: props.project.published,
    download,
  }
}

export default useTranslation
