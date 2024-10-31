import i18next from "i18next"

import translationDE from "./languages/de.json"
import translationEN from "./languages/en.json"
import translationES from "./languages/es.json"
import translationFR from "./languages/fr.json"
import translationIT from "./languages/it.json"
import translationPT from "./languages/pt.json"

// remember to add the new languages to the next-sitemap.config.js file
export const languagesSupported = ["en", "es", "it", "fr", "pt", "de"]

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
    fr: {
      translation: translationFR,
    },
    pt: {
      translation: translationPT,
    },
    de: {
      translation: translationDE,
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
  instance: i18next,
  changeLanguage: (lang: string) => {
    // if (!languagesSupported.includes(lang)) {
    //   throw "Language not found"
    // }

    i18next.changeLanguage(lang)
  },
  getLanguage: () => i18next.language,
  t: (key: I18nKey, vars: any = undefined) => {
    return i18next.t(key, vars).toString()
  },
}
