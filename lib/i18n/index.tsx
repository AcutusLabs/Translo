import i18next from "i18next"

import translationEN from "./languages/en.json"
import translationES from "./languages/es.json"
import translationIT from "./languages/it.json"

export const languagesSupported = ["en", "es", "it"]

export const defaultLanguage = "en"

i18next.init({
  resources: {
    en: {
      translation: translationEN,
    },
    es: {
      translation: translationES,
    },
    it: {
      translation: translationIT,
    },
  },
  lng: defaultLanguage,
  debug: false,
  interpolation: {
    escapeValue: false,
  },
  nsSeparator: false,
  keySeparator: false,
  fallbackLng: false,
})

export type I18nKey = keyof typeof translationEN

export default {
  changeLanguage: (lang: string) => {
    if (!languagesSupported.includes(lang)) {
      throw "Language not found"
    }

    i18next.changeLanguage(lang)
  },
  t: (key: I18nKey) => i18next.t(key),
}
