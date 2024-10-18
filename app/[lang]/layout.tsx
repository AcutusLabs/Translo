import { Inter as FontSans } from "next/font/google"
import localFont from "next/font/local"

import "@/styles/globals.css"

import { ParsedUrlQuery } from "querystring"
import { Suspense } from "react"
import { NextPageContext } from "next"

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
  params: {
    lang: string
  }
}

export const metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "localization management",
    "Localization software",
    "Localization tool",
    "Self-hosted localization",
    "Localization platform",
    "Localization solution",
    "Multilingual content management",
    "Cloud-based localization solution",
    "Translation software",
  ],
  authors: [
    {
      name: "Giacomo e Davide",
      url: "https://github.com/Matergi/Translo",
    },
  ],
  creator: "Giacomo e Davide",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.jpg`],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
}

export default async function RootLayout({
  children,
  params: { lang },
}: RootLayoutProps) {
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
