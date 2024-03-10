"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const handleToggle = React.useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light")
  }, [setTheme, theme])

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 w-8 px-0"
      onClick={handleToggle}
    >
      <Icons.sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Icons.moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
