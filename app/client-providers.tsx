"use client"

import { SessionProvider } from "next-auth/react"

import i18n from "@/lib/i18n"

export default function ClientProvider(props: { children: React.ReactNode }) {
  i18n.changeLanguage("en")
  return <SessionProvider>{props.children}</SessionProvider>
}
