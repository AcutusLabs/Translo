"use client"

import { useEffect } from "react"
import posthog from "posthog-js"

import { PageAnalytics } from "@/lib/analytics-client"

type PageViewProps = {
  page: PageAnalytics
}

const PageView = (props: PageViewProps) => {
  const { page } = props

  useEffect(() => {
    posthog.capture("translo_pageview", { page })
  }, [page])

  return <></>
}

export default PageView
