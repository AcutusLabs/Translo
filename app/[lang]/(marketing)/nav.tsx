"use client"

import Link from "next/link"

import { marketingConfig } from "@/config/marketing"
import i18n from "@/lib/i18n"
import { navigate } from "@/lib/link"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import LanguageSwitch from "@/components/ui/language-switch"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"

export default () => (
  <div className="flex h-20 items-center justify-between py-6">
    <MainNav items={marketingConfig().mainNav} />
    <div className="flex space-x-2">
      <div
        data-testid="language-selector-trigger-desktop"
        className="hidden md:block"
      >
        <LanguageSwitch />
      </div>
      <ThemeToggle />
      <nav>
        <Link
          href={navigate().login()}
          className={cn(
            buttonVariants({ variant: "secondary", size: "sm" }),
            "px-4"
          )}
        >
          {i18n.t("Login")}
        </Link>
      </nav>
    </div>
  </div>
)
