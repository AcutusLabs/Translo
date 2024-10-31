"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { IStaticMethods } from "preline/preline"

declare global {
  interface Window {
    HSStaticMethods: IStaticMethods
  }
}

export default function PrelineScript() {
  const path = usePathname()

  useEffect(() => {
    const loadPreline = async () => {
      await import("preline/preline")

      window.HSStaticMethods.autoInit()

      function mutationCallback() {
        window.HSStaticMethods.autoInit()
      }

      const config = {
        attributes: true,
        childList: true,
        subtree: true,
      }
      const observer = new MutationObserver(mutationCallback)
      observer.observe(document.body, config)
    }

    loadPreline()
  }, [path])

  return null
}
