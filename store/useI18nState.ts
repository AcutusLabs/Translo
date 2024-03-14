import { Project } from "@prisma/client"
import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"

import { NewKeyword } from "@/components/app/project/dialogs/add-new-keyword"
import { ImportKeywords } from "@/components/app/project/dialogs/import-keywords"

export type Language = {
  lang: string
  short: string
}

export type EditLanguageType = Language & { exShortName: string }

export type I18nInfo = {
  key: string
  context: string
}

export type I18nLang = Language & {
  keywords: Record<string, string>
}

export type ConstantTranslations = {
  _id: string
  [lang: string]: string
}

export enum Sex {
  Male = "male",
  Female = "female",
  Other = "other",
}

export enum Formality {
  Formal = "formal",
  Informal = "informal",
  Neutral = "neutral",
}

export type ProjectSettings = {
  description?: string
  formality: Formality
  audience: Sex[]
  ageStart?: string
  ageEnd?: string
  constantTranslations: ConstantTranslations[]
}

export type I18n = Pick<
  Project,
  "title" | "languages" | "info" | "settings" | "published"
> & {
  languages: I18nLang[]
  info: I18nInfo[]
  settings: ProjectSettings
}

export type I18nState = {
  i18n: I18n
  setTitle: (title: string) => void
  addLanguage: (language: Language) => void
  editLanguage: (Language: EditLanguageType) => void
  deleteLanguage: (language: Language) => void
  editContext: (key: string, context: string) => void
  editKey: (key: string, newKey: string) => void
  editTranslation: (language: string, key: string, value: string) => void
  editSettings: (newSettings: Partial<ProjectSettings>) => void
  addNewConstantTranslation: (newword: ConstantTranslations) => void
  addKey: (keyword: NewKeyword) => void
  importKeys: (keywords: ImportKeywords, language: string) => void
  deleteKey: (key: string) => void
  setI18n: (i18n: I18n) => void
  reset: () => void
}

const defaultProjectSettings: ProjectSettings = {
  formality: Formality.Neutral,
  audience: [Sex.Female, Sex.Male, Sex.Other],
  constantTranslations: [],
}

export const initialI18nState: I18n = {
  title: "",
  info: [],
  languages: [
    {
      lang: "English",
      short: "en",
      keywords: {},
    },
  ],
  settings: defaultProjectSettings,
  published: false,
}

export const useI18nState = create<I18nState>()(
  subscribeWithSelector((set) => ({
    i18n: initialI18nState,
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
          languages: [
            ...state.i18n.languages,
            { lang: language.lang, short: language.short, keywords: {} },
          ],
        },
      })),
    editLanguage: (languageToEdit: EditLanguageType) =>
      set((state) => ({
        i18n: {
          ...state.i18n,
          languages: state.i18n.languages.map((language) => {
            if (language.short !== languageToEdit.exShortName) {
              return language
            }

            return {
              ...language,
              lang: languageToEdit.lang,
              short: languageToEdit.short,
            }
          }),
        },
      })),
    deleteLanguage: (languageToDelete: Language) =>
      set((state) => ({
        i18n: {
          ...state.i18n,
          languages: (state.i18n.languages as I18nLang[]).filter(
            (language) => language.short !== languageToDelete.short
          ),
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
    importKeys: (keywords: ImportKeywords, languageRef: string) =>
      set((state) => {
        const newInfo: I18nInfo[] = [...state.i18n.info]

        Object.keys(keywords).forEach((key) => {
          newInfo.push({ key: key, context: "" })
        })

        const newI18n = {
          ...state.i18n,
          info: newInfo,
          languages: state.i18n.languages.map((_language) => {
            if (_language.short !== languageRef) {
              return _language
            }

            const newKeywords = { ..._language.keywords, ...keywords }

            return {
              ..._language,
              keywords: newKeywords,
            }
          }),
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
    editKey: (key: string, newKey: string) =>
      set((state) => {
        if (key === newKey) {
          return state
        }

        return {
          i18n: {
            ...state.i18n,
            languages: state.i18n.languages.map((_language) => {
              const keywords = {
                ..._language.keywords,
                [newKey]: _language.keywords[key],
              }

              delete keywords[key]

              return {
                ..._language,
                keywords,
              }
            }),
            info: (state.i18n.info as I18nInfo[])
              .filter((info) => info.key !== newKey)
              .map((info) => {
                if (info.key !== key) {
                  return info
                }

                return {
                  ...info,
                  key: newKey,
                }
              }),
          },
        }
      }),
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
    editSettings: (newSettings: Partial<ProjectSettings>) =>
      set((state) => {
        const settings: ProjectSettings =
          (state.i18n.settings as ProjectSettings) || defaultProjectSettings
        return {
          i18n: {
            ...state.i18n,
            settings: {
              ...settings,
              ...newSettings,
            },
          },
        }
      }),
    addNewConstantTranslation: (newWord: ConstantTranslations) =>
      set((state) => {
        const settings: ProjectSettings =
          (state.i18n.settings as ProjectSettings) || defaultProjectSettings
        return {
          i18n: {
            ...state.i18n,
            settings: {
              ...settings,
              constantTranslations: [
                ...state.i18n.settings.constantTranslations,
                newWord,
              ],
            },
          },
        }
      }),
    setI18n: (i18n: I18n) => set({ i18n }),
    reset: () => set({ i18n: { ...initialI18nState } }),
  }))
)
