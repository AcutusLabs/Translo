import { useCallback } from "react"
import FileSaver from "file-saver"
import JSZip from "jszip"
import _ from "lodash"

import i18n from "@/lib/i18n"
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

  const { data: languagesFromApi } = useGetLanguages({
    projectId: projectFromSSR.id,
    initialData: projectFromSSR.languages,
  })

  const keywordsFromApi = useGetKeywords({
    projectId: projectFromSSR.id,
    defaultLanguage: i18n.getLanguage(),
    initialData: {
      keywords: projectFromSSR.keywords,
      languages: languagesFromApi,
    },
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

  const downloadFiles = useCallback(() => {
    const zip = new JSZip()

    project.languages.forEach((language: LanguageData) => {
      const translations = project.keywords.reduce(
        (acc, keyword) => ({
          ...acc,
          [keyword.keyword]: keyword.translations.find(
            (translation) => translation.language.short === language.short
          )?.value,
        }),
        {}
      )
      zip.file(`${language.short}.json`, JSON.stringify(translations, null, 4))
    })

    zip.generateAsync({ type: "blob" }).then(function (content) {
      FileSaver.saveAs(
        content,
        `${project.title.replaceAll(" ", "-")}-translations.zip`
      )
    })
  }, [project.title, project.languages, project.keywords])

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

  return {
    tokens: tokensFromApi as number,
    project,
    isPublished: props.project.published,
    download,
  }
}

export default useTranslation
