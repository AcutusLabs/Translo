import * as React from "react"

import { cn } from "@/lib/utils"

import { Icons } from "./icons"

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer
      className={cn(
        "w-full max-w-[85rem] py-10 px-4 sm:px-6 lg:px-8 mx-auto",
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
            Translo
          </a>
        </div>

        <div className="mt-3">
          <p className="text-gray-500">
            Made with <span className="text-[#E25555]">&#9829;</span> by Giacomo
            and Davide
          </p>
        </div>

        <div className="mt-3 space-x-2">
          <a
            className="inline-flex justify-center items-center size-10 text-center text-gray-500 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white transition dark:text-gray-500 dark:hover:text-gray-200 dark:hover:bg-gray-800"
            href="https://github.com/Matergi/Translo"
          >
            <Icons.gitHub className="shrink-0 size-3.5" />
          </a>
        </div>
      </div>
    </footer>
  )
}
