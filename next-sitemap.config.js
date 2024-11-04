const languagesSupported = ["en", "es", "it", "fr", "pt", "de"]

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://translo.app/en",
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 5000,
  generateIndexSitemap: false,
  exclude: ["/api"],
  alternateRefs: languagesSupported.map((language) => ({
    href: `https://translo.app/${language}`,
    hreflang: language,
  })),
  // Default transformation function
  transform: async (config, path) => {
    return {
      loc: path, // => this will be exported as http(s)://<config.siteUrl>/<path>
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    }
  },
  additionalPaths: async (config) => [
    await config.transform(config, "/"),
    await config.transform(config, "/pricing"),
    await config.transform(config, "/login"),
    await config.transform(config, "/register"),
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  },
}
