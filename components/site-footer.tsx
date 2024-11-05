import * as React from "react"

import i18n from "@/lib/i18n"
import { cn } from "@/lib/utils"

import { Icons } from "./icons"
import LanguageSwitch from "./ui/language-switch"

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  const heart = "♥️"
  return (
    <footer
      className={cn(
        "mx-auto w-full max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8",
        className
      )}
    >
      <div className="text-center">
        <div>
          <a
            className="flex-none text-xl font-semibold text-black dark:text-white dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
            href="#"
            aria-label="Brand"
          >
            {i18n.t("Translo")}
          </a>
        </div>

        <div className="mt-3">
          <p className="text-gray-500">
            {i18n.t("Made with ")}
            <span className="text-[#E25555]">{heart}</span>
            {i18n.t("by Giacomo and Davide")}
          </p>
        </div>

        <div
          data-testid="language-selector-trigger-mobile"
          className="mt-4 md:hidden sm:block"
        >
          <LanguageSwitch />
        </div>

        <div className="mt-3 space-x-2">
          <a
            className="inline-flex size-10 items-center justify-center rounded-full text-center text-gray-500 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            href="https://github.com/Matergi/Translo"
          >
            <Icons.gitHub className="size-3.5 shrink-0" />
          </a>
        </div>
      </div>
    </footer>
  )
}
