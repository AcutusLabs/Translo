"use client"

import React from "react"
import { usePathname, useRouter } from "next/navigation"

import { languagesSupported } from "@/lib/i18n"
import { getLanguageFlag } from "@/lib/utils"

const LanguageSwitch = () => {
  const router = useRouter()
  const pathname = usePathname() || "/en/"

  const [, currentLanguage] = pathname.match(/^\/([^\/]+)\/?.*/i) || [, "en"]

  return (
    <div className="hs-dropdown [--placement:top-left] relative inline-flex">
      <button
        data-testid="language-selector"
        id="hs-footer-language-dropdown"
        type="button"
        className="hs-dropdown-toggle py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
        aria-haspopup="menu"
        aria-expanded="false"
        aria-label="Dropdown"
      >
        <div>{getLanguageFlag(currentLanguage).flag}</div>
        <div>{getLanguageFlag(currentLanguage).name}</div>
        <svg
          className="rotate-180 hs-dropdown-open:rotate-0 shrink-0 size-4 text-gray-500 dark:text-neutral-500"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m18 15-6-6-6 6"></path>
        </svg>
      </button>
      <div
        className="hs-dropdown-menu w-40 transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 z-10 bg-white shadow-md rounded-lg p-2 dark:bg-neutral-800 dark:border dark:border-neutral-700 dark:divide-neutral-700 hidden"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="hs-footer-language-dropdown"
      >
        {languagesSupported
          .filter((language) => language !== currentLanguage)
          .map((language) => (
            <div
              data-testid={`language-selector-${language}`}
              key={language}
              className="flex items-center gap-x-2 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700 dark:focus:text-neutral-300 hover:cursor-pointer"
              onClick={() => {
                router.replace(
                  pathname.replace(
                    /^\/([^\/]+)(\/?.*)/i,
                    (_match, _exLang, other) => {
                      return `/${language}${other}`
                    }
                  )
                )
              }}
            >
              <div>{getLanguageFlag(language).flag}</div>
              <div>{getLanguageFlag(language).name}</div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default LanguageSwitch
