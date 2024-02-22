import { Translation } from "@prisma/client"
import { create } from "zustand"

import { NewKeyword } from "@/components/translation/dialogs/add-new-keyword"

export enum Language {
  IT = "it",
  EN = "en",
  ES = "es",
}

export type I18nInfo = {
  key: string
  description: string
}
export type I18nLang = {
  lang: Language
  keywords: Record<string, string>
}
export type I18n = Pick<Translation, "title" | "languages" | "info"> & {
  languages: I18nLang[]
  info: I18nInfo[]
}
export type I18nState = {
  i18n: I18n
  addLanguage: (language: string) => void
  addTranslation: (language: string, key: string, value: string) => void
  addKey: (keyword: NewKeyword) => void
  deleteKey: (key: string) => void
  setI18n: (i18n: I18n) => void
  reset: () => void
}

const initialState: I18n = {
  title: "Title",
  info: [
    {
      key: "app.hello-world",
      description: "Used in the registration email",
    },
    {
      key: "app.goodbye-world",
      description: "Used during logout",
    },
    {
      key: "app.only-en",
      description: "",
    },
  ],
  languages: [
    {
      lang: Language.EN,
      keywords: {
        "app.hello-world": "Hello, World!",
        "app.goodbye-world": "Goodbye, World!",
        "app.only-en": "hey!",
      },
    },
    {
      lang: Language.IT,
      keywords: {
        "app.hello-world": "Hello, World!",
        "app.goodbye-world": "Goodbye, World!",
        "app.only-en": "",
      },
    },
  ],
}

export const useI18nState = create<I18nState>()((set) => ({
  i18n: initialState,
  setTitle: (title: string) => {
    set((state) => ({
      i18n: {
        ...state.i18n,
        title,
      },
    }))
  },
  addLanguage: (language: Language) =>
    set((state) => ({
      i18n: {
        ...state.i18n,
        languages: [...state.i18n.languages, { lang: language, keywords: {} }],
      },
    })),
  deleteKey: (key: string) => {
    set((state) => ({
      i18n: {
        ...state.i18n,
        info: (state.i18n.info as I18nInfo[]).filter(
          (info) => info.key !== key
        ),
        languages: state.i18n.languages.map((_language) => {
          const newKeywords = { ..._language.keywords }
          delete newKeywords[key]

          return {
            ..._language,
            keywords: newKeywords,
          }
        }),
      },
    }))
  },
  addKey: (keyword: NewKeyword) =>
    set((state) => {
      const keywordAlreadyExists = state.i18n.info.some(
        (info: I18nInfo) => info.key === keyword.key
      )

      if (keywordAlreadyExists) {
        return state
      }

      const newInfo: I18nInfo[] = [
        ...state.i18n.info,
        { key: keyword.key, description: keyword.description },
      ]

      const newI18n = {
        ...state.i18n,
        info: newInfo,
        languages: state.i18n.languages.map((_language) => ({
          ..._language,
          keywords: {
            ..._language.keywords,
            [keyword.key]: "",
          },
        })),
      }

      console.log("newI18n", newI18n)
      return {
        i18n: newI18n,
      }
    }),
  addTranslation: (language: string, key: string, value: string) =>
    set((state) => ({
      i18n: {
        ...state.i18n,
        languages: state.i18n.languages.map((_language) => {
          if (_language.lang !== language) {
            return _language
          }

          return {
            ..._language,
            [key]: value,
          }
        }),
      },
    })),
  setI18n: (i18n: I18n) => set({ i18n }),
  reset: () => set({ i18n: { ...initialState } }),
}))
