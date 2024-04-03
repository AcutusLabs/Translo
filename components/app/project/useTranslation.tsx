import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import {
  I18n,
  I18nInfo,
  I18nLang,
  Language,
  ProjectSettings,
  useI18nState,
} from "@/store/useI18nState"
import FileSaver from "file-saver"
import JSZip from "jszip"
import _ from "lodash"
import debounce from "lodash/debounce"

import { AlertType } from "@/types/api"
import { MAX_KEYWORDS_STARTER_URSER } from "@/lib/constants"
import i18nLib from "@/lib/i18n"
import { AlertContext } from "@/app/client-providers"

import { EditorProps } from "."
import { toast } from "../../ui/use-toast"
import { NewKeyword } from "./dialogs/add-new-keyword"
import { ImportKeywords } from "./dialogs/import-keywords"

type LanguagesAvailable = {
  language: string
  available: boolean
  short: string
}

type KeywordLanguage = {
  value: string
  language: string
  short: string
}

export type Keyword = {
  key: string
  info?: I18nInfo
  languages: KeywordLanguage[]
  languagesAvailable: LanguagesAvailable[]
}

export enum DownloadFormat {
  json_files = "json_files",
}

export enum Status {
  Saved = "saved",
  ToSave = "to-save",
  Saving = "saving",
}

const useTranslation = (props: EditorProps) => {
  const {
    i18n,
    editTranslation: editTranslationStore,
    addKey,
    deleteKey,
    setI18n,
    setTitle,
    editContext,
    editSettings,
    editKey,
    addLanguage,
    editLanguage,
    deleteLanguage,
    addNewTerm,
    importKeys: _importKeys,
  } = useI18nState()

  const [status, setStatus] = useState<Status>(Status.Saved)
  const alertContext = useContext(AlertContext)

  const keywords = useMemo((): Keyword[] => {
    if (!i18n.info || !i18n.info.length) {
      return []
    }

    const allKeywords = i18n.info.map((info) => info.key)

    return allKeywords.map((keyword) => ({
      key: keyword,
      info: (i18n.info as I18nInfo[]).find((info) => info.key === keyword),
      languages: i18n.languages.map((language) => {
        return {
          value: language.keywords[keyword],
          language: language.lang,
          short: language.short,
        }
      }),
      languagesAvailable: (i18n.languages as I18nLang[]).map((language) => ({
        language: language.lang,
        short: language.short,
        available: !!language.keywords[keyword],
      })),
    }))
  }, [i18n.info, i18n.languages])

  const save = useCallback(
    async (newI18n?: I18n) => {
      setStatus(Status.Saving)

      const response = await fetch(`/api/projects/${props.project.id}`, {
        method: "PATCH",
        headers: {
          "languages-Type": "application/json",
        },
        body: JSON.stringify(newI18n ?? i18n),
      })

      setStatus(Status.Saved)

      if (!response?.ok) {
        return toast({
          title: i18nLib.t("Something went wrong"),
          description: i18nLib.t(
            "Your project was not saved. Please try again"
          ),
          variant: "destructive",
        })
      }
    },
    [i18n, props.project.id]
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce((newI18n) => {
      save(newI18n)
    }, 2000),
    []
  )

  useEffect(() => {
    setI18n({
      title: props.project.title,
      languages: (props.project.languages || []) as I18nLang[],
      info: (props.project.info || []) as I18nInfo[],
      settings: props.project.settings as ProjectSettings,
      published: props.project.published,
    })

    const unsbuscribe = useI18nState.subscribe(
      (state) => state.i18n,
      (i18n) => {
        setStatus(Status.ToSave)
        debouncedSave(i18n)
      }
    )

    return () => {
      unsbuscribe()
    }
  }, [debouncedSave, props.project, setI18n])

  // const [pauseAutocomplete, setPauseAutocomplete] = useState(false)

  const addNewKey = useCallback(
    (keyword: NewKeyword) => {
      if (keywords.length + 1 > MAX_KEYWORDS_STARTER_URSER) {
        alertContext.showAlert(AlertType.keywordsSubscriptionNeeded)
        return
      }
      addKey(keyword)
    },
    [addKey, alertContext, keywords.length]
  )

  const importKeys = useCallback(
    (keywords: ImportKeywords, languageRef: string) => {
      _importKeys(keywords, languageRef)
    },
    [_importKeys]
  )

  // const setChatGPTPause = () => {
  //   setPauseAutocomplete(true)
  //   setTimeout(() => {
  //     setPauseAutocomplete(false)
  //   }, 10000)
  // }

  // const { mutate, isLoading } = useMutation({
  //   mutationFn: async () => await autocompleteI18nObject(i18n),
  //   onSuccess: (data: I18n) => {
  //     setI18n(data)
  //     setChatGPTPause()
  //   },
  //   onError: () => {
  //     setChatGPTPause()
  //   },
  // })

  // const autocomplete = useCallback(() => {
  //   mutate()
  // }, [mutate])

  // const autocompleteButtonText = useMemo(() => {
  //   if (isLoading) {
  //     return <Spinner />
  //   }
  //   return pauseAutocomplete ? "need to recharge ChatGPT..." : "Autogenerate"
  // }, [isLoading, pauseAutocomplete])

  const downloadFiles = useCallback(() => {
    const zip = new JSZip()

    i18n.languages.forEach((language: I18nLang) => {
      zip.file(
        `${language.short}.json`,
        JSON.stringify(language.keywords, null, 4)
      )
    })

    zip.generateAsync({ type: "blob" }).then(function (content) {
      FileSaver.saveAs(
        content,
        `${props.project.title.replaceAll(" ", "-")}-translations.zip`
      )
    })
  }, [i18n.languages, props.project.title])

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

  const editTranslation = useCallback(
    (language: string, key: string, value: string) => {
      editTranslationStore(language, key, value)
    },
    [editTranslationStore]
  )

  const publishProject = useCallback(
    async (isPublished: boolean) => {
      const response = await fetch(`/api/projects/${props.project.id}`, {
        method: "PATCH",
        headers: {
          "languages-Type": "application/json",
        },
        body: JSON.stringify({
          published: isPublished,
        }),
      })

      if (!response?.ok) {
        return toast({
          title: i18nLib.t("Something went wrong"),
          description: i18nLib.t(
            "Your project was not saved. Please try again"
          ),
          variant: "destructive",
        })
      }
    },
    [props.project.id]
  )

  const languages: Language[] = useMemo(
    () =>
      i18n.languages.map((language) => ({
        lang: language.lang,
        short: language.short,
      })),
    [i18n.languages]
  )

  const checkIfKeyAlreadyExists = useCallback(
    (key: string): boolean => {
      if (key) {
        return (
          (i18n.info as I18nInfo[]).find((info) => info.key === key) !==
          undefined
        )
      }

      return false
    },
    [i18n.info]
  )

  return {
    title: i18n.title,
    keywords,
    languages,
    i18nLanguages: i18n.languages,
    settings: i18n.settings,
    editTranslation,
    addNewKey,
    deleteKey,
    save,
    status,
    isPublished: props.project.published,
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
  }
}

export default useTranslation
