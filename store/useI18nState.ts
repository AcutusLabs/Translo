import { Translation } from "@prisma/client"
import { create } from "zustand"

import { NewKeyword } from "@/components/translation/dialogs/add-new-keyword"

export type I18nInfo = {
  key: string
  context: string
}
export type I18nLang = {
  lang: string
  keywords: Record<string, string>
}
export type I18n = Pick<Translation, "title" | "languages" | "info"> & {
  languages: I18nLang[]
  info: I18nInfo[]
}
export type I18nState = {
  i18n: I18n
  setTitle: (title: string) => void
  addLanguage: (language: string) => void
  editContext: (key: string, context: string) => void
  editTranslation: (language: string, key: string, value: string) => void
  addKey: (keyword: NewKeyword) => void
  deleteKey: (key: string) => void
  setI18n: (i18n: I18n) => void
  reset: () => void
}

export const initialI18nState: I18n = {
  title: "",
  info: [],
  languages: [
    {
      lang: "en",
      keywords: {},
    },
  ],
}

export const useI18nState = create<I18nState>()((set) => ({
  i18n: initialI18nState,
  setTitle: (title: string) => {
    set((state) => ({
      i18n: {
        ...state.i18n,
        title,
      },
    }))
  },
  addLanguage: (language: string) =>
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
        { key: keyword.key, context: keyword.context },
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

      return {
        i18n: newI18n,
      }
    }),
  editContext: (key: string, context: string) =>
    set((state) => ({
      i18n: {
        ...state.i18n,
        info: state.i18n.info.map((info) => {
          if (info.key !== key) {
            return info
          }

          return {
            ...info,
            context,
          }
        }),
      },
    })),
  editTranslation: (language: string, key: string, value: string) =>
    set((state) => ({
      i18n: {
        ...state.i18n,
        languages: state.i18n.languages.map((_language) => {
          if (_language.lang !== language) {
            return _language
          }

          return {
            ..._language,
            keywords: {
              ..._language.keywords,
              [key]: value,
            },
          }
        }),
      },
    })),
  setI18n: (i18n: I18n) => set({ i18n }),
  reset: () => set({ i18n: { ...initialI18nState } }),
}))
