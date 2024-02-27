import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { I18nInfo, I18nLang, useI18nState } from "@/store/useI18nState"

import { EditorProps } from "."
import { toast } from "../ui/use-toast"
import { NewKeyword } from "./dialogs/add-new-keyword"

type LanguagesAvailable = {
  language: string
  available: boolean
}

type KeywordLanguage = {
  value: string
  language: string
}

export type Keyword = {
  key: string
  info?: I18nInfo
  languages: KeywordLanguage[]
  languagesAvailable: LanguagesAvailable[]
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
  } = useI18nState()

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
        }
      }),
      languagesAvailable: (i18n.languages as I18nLang[]).map((language) => ({
        language: language.lang,
        available: !!language.keywords[keyword],
      })),
    }))
  }, [i18n.info, i18n.languages])

  useEffect(() => {
    setI18n({
      title: props.translation.title,
      languages: (props.translation.languages || []) as I18nLang[],
      info: (props.translation.info || []) as I18nInfo[],
    })
  }, [props.translation, setI18n])

  const router = useRouter()

  // const [pauseAutocomplete, setPauseAutocomplete] = useState(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)

  const addNewKey = useCallback(
    (keyword: NewKeyword) => {
      addKey(keyword)
    },
    [addKey]
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

  // const downloadFile = useCallback(() => {
  //   const fileName = "i18n"
  //   const json = JSON.stringify(i18n, null, 2)
  //   const blob = new Blob([json], { type: "application/json" })
  //   const href = URL.createObjectURL(blob)

  //   const link = document.createElement("a")
  //   link.href = href
  //   link.download = fileName + ".json"
  //   document.body.appendChild(link)
  //   link.click()

  //   document.body.removeChild(link)
  //   URL.revokeObjectURL(href)
  // }, [i18n])

  const editTranslation = useCallback(
    (language: string, key: string, value: string) => {
      editTranslationStore(language, key, value)
    },
    [editTranslationStore]
  )

  const save = useCallback(async () => {
    setIsSaving(true)

    const response = await fetch(`/api/translations/${props.translation.id}`, {
      method: "PATCH",
      headers: {
        "languages-Type": "application/json",
      },
      body: JSON.stringify(i18n),
    })

    setIsSaving(false)

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Your translation was not saved. Please try again.",
        variant: "destructive",
      })
    }

    router.refresh()

    return toast({
      description: "Your translation has been saved.",
    })
  }, [i18n, props.translation.id, router])

  return {
    title: i18n.title,
    keywords,
    editTranslation,
    addNewKey,
    deleteKey,
    save,
    isSaving,
    setTitle,
    editContext,
  }
}

export default useTranslation
