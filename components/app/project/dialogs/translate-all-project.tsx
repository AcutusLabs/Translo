import { useContext } from "react"

import i18n from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { useTranslateProject } from "@/hooks/api/project/use-translate-project"
import { useCostEstimation } from "@/hooks/use-cost-estimation"
import { buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlertContext } from "@/app/[lang]/client-providers"

import { KeywordData, LanguageData } from "../types"

type TranslateAllKeywordsProps = {
  projectId: string
  languages: LanguageData[]
  keywords: KeywordData[]
  tokens: number
  setProgress: (progress: number | undefined) => void
  setCurrentKeywordInTranslateAll: (keyword: string) => void
}

export function TranslateAllKeywords(props: TranslateAllKeywordsProps) {
  const {
    projectId,
    languages,
    keywords,
    tokens,
    setProgress,
    setCurrentKeywordInTranslateAll,
  } = props

  const cost = useCostEstimation({
    sentences: keywords
      .filter((keyword) => keyword.translations.length !== languages.length)
      .map(
        (keyword) =>
          keyword.translations.find((t) => t.language.short === "en")?.value ||
          ""
      ),
    numberOfLanguages: languages.length,
    context: "template",
    description: "template",
    glossary: [],
  })

  const alertContext = useContext(AlertContext)

  const { mutate: translateProject } = useTranslateProject({
    projectId: projectId,
    languages: languages,
    keywords: keywords,
    onUpdate: (progress) => {
      setProgress(progress)
    },
    onSuccess: () => {
      setProgress(undefined)
    },
    onError: () => {
      setProgress(undefined)
    },
    showAlertType: alertContext.showAlert,
    setCurrentKeywordInTranslateAll,
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "outline-none mr-4"
          )}
        >
          <span>{i18n.t("Translate")}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-w-[500px]">
        <div className="pr-4">
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              <p className="truncate text-m pt-3">
                {i18n.t("Translate all project:")}
              </p>
            </div>
          </div>
          {languages.length > 1 ? (
            <div className="p-2 flex flex-col">
              <span
                className="mt-2 text-sm"
                dangerouslySetInnerHTML={{
                  __html: i18n.t(
                    "To translate it, it will cost you: ~{number} tokens",
                    { number: cost }
                  ),
                }}
              ></span>
              <span
                className="mt-2 text-sm"
                dangerouslySetInnerHTML={{
                  __html: i18n.t("You still have {number} tokens", {
                    number: tokens,
                  }),
                }}
              ></span>
            </div>
          ) : (
            <div className="flex items-center justify-start gap-2 pl-2 pb-2">
              <div className="flex flex-col leading-none">
                <p className="truncate text-xs pt-3">
                  {i18n.t(
                    "You need to have at least 2 languages to translate the project"
                  )}
                </p>
              </div>
            </div>
          )}
        </div>

        {languages.length > 1 ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              asChild
              className="hover:cursor-pointer flex"
              onClick={() => translateProject()}
            >
              <p>{i18n.t("Translate everything")}</p>
            </DropdownMenuItem>
          </>
        ) : (
          <div />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
