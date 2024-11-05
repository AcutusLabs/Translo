import { Inter as FontSans } from "next/font/google"
import localFont from "next/font/local"

import "@/styles/globals.css"

import { ParsedUrlQuery } from "querystring"
import { Suspense } from "react"
import { Metadata, NextPageContext } from "next"

import { env } from "@/env.mjs"
import { siteConfig } from "@/config/site"
import i18n from "@/lib/i18n"
import PrelineScript from "@/lib/preline"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@/components/analytics"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"

import ClientProvider from "./client-providers"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

// Font files can be colocated inside of `pages`
const fontHeading = localFont({
  src: "../../assets/fonts/CalSans-SemiBold.woff2",
  variable: "--font-heading",
})

interface RootLayoutProps {
  children: React.ReactNode
  params: Promise<{
    lang: string
  }>
}

export async function generateMetadata({
  params,
}: RootLayoutProps): Promise<Metadata> {
  const lang = (await params).lang
  i18n.changeLanguage(lang)
  return {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
    description: i18n.t(
      "Translo provides open-source localization management that you can self-host."
    ),
    keywords: i18n.t("metadata.keywords"),
    authors: [
      {
        name: "Giacomo e Davide",
        url: "https://github.com/Matergi/Translo",
      },
    ],
    creator: "Giacomo e Davide",
    openGraph: {
      type: "website",
      locale: lang,
      url: siteConfig.url,
      title: siteConfig.name,
      description: i18n.t(
        "Translo provides open-source localization management that you can self-host."
      ),
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.name,
      description: i18n.t(
        "Translo provides open-source localization management that you can self-host."
      ),
      images: [`${siteConfig.url}/og.jpg`],
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png",
    },
    manifest: `${siteConfig.url}/site.webmanifest`,
  }
}

export default async function RootLayout(props: RootLayoutProps) {
  const params = await props.params

  const { lang } = params

  const { children } = props

  i18n.changeLanguage(lang)
  return (
    <html lang={lang} suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontHeading.variable
        )}
      >
        <ClientProvider lang={lang}>
          <div>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <Suspense>
                {children}
                <PrelineScript />
              </Suspense>
              <Analytics />
              <Toaster />
              <TailwindIndicator />
            </ThemeProvider>
          </div>
        </ClientProvider>
      </body>
    </html>
  )
}

RootLayout.getInitialProps = async (ctx: NextPageContext) => {
  let SSRProps: SSRProps = {}

  const overrideLanguage = getStringParams(ctx.query, "lang")
  const newLanguage = overrideLanguage || ""

  if (newLanguage) {
    SSRProps = { ...SSRProps, newLanguage }
    if (overrideLanguage) {
      SSRProps.shouldChangeLanguage = true
    }
  }

  return SSRProps
}

type SSRProps = {
  newLanguage?: string
  shouldChangeLanguage?: boolean
}

const getStringParams = (params: ParsedUrlQuery, key: string): string => {
  const value: string = params[key]?.toString() ?? ""

  return value
}
