"use client"

import { useState } from "react"
import { ChakraProvider } from "@chakra-ui/react"
import { SessionProvider } from "next-auth/react"
import { QueryClient, QueryClientProvider } from "react-query"

import i18n from "@/lib/i18n"

export default function RootLayout(props: { children: React.ReactNode }) {
  i18n.changeLanguage("en")
  const [queryClient] = useState(() => new QueryClient())

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>{props.children}</ChakraProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}
