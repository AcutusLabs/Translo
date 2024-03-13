"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SessionProvider } from "next-auth/react"
import { AppProgressBar as ProgressBar } from "next-nprogress-bar"

import i18n from "@/lib/i18n"

const queryClient = new QueryClient()

export default function ClientProvider(props: { children: React.ReactNode }) {
  i18n.changeLanguage("en")
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        {props.children}
        <ProgressBar
          height="2px"
          color="#44403c"
          options={{ showSpinner: false }}
          shallowRouting
        />
      </SessionProvider>
    </QueryClientProvider>
  )
}
