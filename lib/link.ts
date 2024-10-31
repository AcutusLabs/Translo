import i18n from "./i18n"

export const navigate = (overrideLang?: string) => {
  const lang = overrideLang || i18n.getLanguage()
  const base = `/${lang}`

  // remember to add the new links to the next-sitemap.config.js file
  return {
    home: () => `${base}`,
    homeFeatures: () => `${base}#features`,
    pricing: () => `${base}/pricing`,
    login: () => `${base}/login`,
    register: () => `${base}/register`,
    dashboard: () => `${base}/dashboard`,
    billing: () => `${base}/dashboard/billing`,
    settings: () => `${base}/dashboard/settings`,
    project: (id: string) => `${base}/projects/${id}`,
  }
}
