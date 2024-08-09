"use client"

import { createContext, useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SessionProvider } from "next-auth/react"
import { AppProgressBar as ProgressBar } from "next-nprogress-bar"
import posthog from "posthog-js"
import { PostHogProvider } from "posthog-js/react"

import { AlertType, ShowAlertType } from "@/types/api"
import i18n from "@/lib/i18n"
import { TooltipProvider } from "@/components/ui/tooltip"
import KeywordsSubscriptionNeededAlert from "@/components/app/globalAlert/keywordsSubscriptionNeededAlert"
import ProjectSubscriptionNeededAlert from "@/components/app/globalAlert/projectSubscriptionNeededAlert"
import TokensRechargeNeeded from "@/components/app/globalAlert/tokensRechargeNeededAlert"

const queryClient = new QueryClient()

// const alertContext = useContext(AlertContext)
export const AlertContext = createContext<{
  alert?: AlertType
  showAlert: ShowAlertType
}>({
  showAlert: () => {},
})

export default function ClientProvider(props: { children: React.ReactNode }) {
  i18n.changeLanguage("en")

  const [alert, showAlert] = useState<AlertType | undefined>()

  if (typeof window !== "undefined" && !posthog.__loaded) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      persistence: "localStorage",
      debug: true,
      capture_pageview: false,
    })
  }

  return (
    <TooltipProvider delayDuration={100}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <PostHogProvider client={posthog}>
            <AlertContext.Provider value={{ alert, showAlert }}>
              <ProjectSubscriptionNeededAlert />
              <KeywordsSubscriptionNeededAlert />
              <TokensRechargeNeeded />
              {props.children}
            </AlertContext.Provider>
            <ProgressBar
              height="2px"
              color="#44403c"
              options={{ showSpinner: false }}
              shallowRouting
            />
          </PostHogProvider>
        </SessionProvider>
      </QueryClientProvider>
    </TooltipProvider>
  )
}
