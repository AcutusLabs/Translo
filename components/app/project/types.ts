import { Keyword, Project, ProjectLanguage, Translation } from "@prisma/client"

export type Term = {
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
  formality?: Formality
  audience?: Sex[]
  ageStart?: string
  ageEnd?: string
  glossary?: Term[]
}

export type ProjectData = Pick<
  Project,
  "id" | "title" | "published" | "settings"
> & {
  languages: LanguageData[]
  keywords: KeywordData[]
  settings: ProjectSettings
}

export type LanguageData = Pick<ProjectLanguage, "id" | "short" | "name">

export type TranslationData = Pick<Translation, "id" | "value" | "history"> & {
  language: LanguageData
}

export type KeywordData = Keyword & {
  translations: TranslationData[]
  defaultTranslation: string
}
