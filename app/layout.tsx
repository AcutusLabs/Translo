import { Inter as FontSans } from "next/font/google"
import localFont from "next/font/local"

import "@/styles/globals.css"
import { Suspense } from "react"

import { env } from "@/env.mjs"
import { siteConfig } from "@/config/site"
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
  src: "../assets/fonts/CalSans-SemiBold.woff2",
  variable: "--font-heading",
})

interface RootLayoutProps {
  children: React.ReactNode
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

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontHeading.variable
        )}
      >
        <ClientProvider>
          <div>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <Suspense>{children}</Suspense>
              <Analytics />
              <Toaster />
              <TailwindIndicator />
            </ThemeProvider>
          </div>
        </ClientProvider>
      </body>
      <PrelineScript />
    </html>
  )
}
