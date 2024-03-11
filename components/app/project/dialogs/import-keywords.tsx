import { ChangeEvent, useCallback, useEffect, useState } from "react"
import { Language } from "@/store/useI18nState"
import { DialogClose } from "@radix-ui/react-dialog"

import i18n from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

import SelectLanguage from "../select-language"

export type ImportKeywords = {
  [key: string]: string
}

type ImportKeywordsModalProps = {
  languages: Language[]
  importKeys: (keywords: ImportKeywords, languageRef: string) => void
}

const ImportKeywordsModal = (props: ImportKeywordsModalProps) => {
  const { languages, importKeys } = props

  const [textJSON, setTextJSON] = useState("")
  const [languageSelected, selectLanguage] = useState<string | undefined>(
    undefined
  )

  const handleChangeTextJSON = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setTextJSON(e.target.value)
    },
    []
  )

  useEffect(() => {
    if (languages.length === 1) {
      selectLanguage(languages[0].short)
    }

    return () => {
      selectLanguage(undefined)
    }
  }, [languages, languages.length])

  const reset = useCallback(() => {
    selectLanguage(undefined)
    setTextJSON("")
  }, [])

  const handleFile = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      const reader = new FileReader()

      reader.onload = (e) => {
        const content = e.target?.result?.toString()

        if (!content) {
          toast({
            title: i18n.t("Something went wrong"),
            description: i18n.t("The content is not available"),
            variant: "destructive",
          })
          return
        }

        try {
          const jsonData = JSON.parse(content)
          setTextJSON(JSON.stringify(jsonData, undefined, 4))
        } catch (error) {
          toast({
            title: i18n.t("Something went wrong"),
            description: i18n.t("Error parsing JSON"),
            variant: "destructive",
          })
        }
      }

      reader.readAsText(file)
    }
  }, [])

  const analyzeKeywords = useCallback(() => {
    if (!languageSelected) {
      return
    }

    try {
      const jsonData = JSON.parse(textJSON)
      importKeys(jsonData, languageSelected)
      reset()
    } catch (error) {
      toast({
        title: i18n.t("Something went wrong"),
        description: i18n.t("Error parsing JSON"),
        variant: "destructive",
      })
    }
  }, [importKeys, languageSelected, reset, textJSON])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className={cn(buttonVariants({ variant: "secondary" }), "mr-4")}
        >
          <span>{i18n.t("Import")}</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{i18n.t("Import keywords")}</DialogTitle>
          <DialogDescription>
            <p className="mt-3">
              {i18n.t("project.Import keywords.description")}
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <SelectLanguage
            languageSelected={languageSelected}
            languages={languages}
            onChangeLanguage={selectLanguage}
          />
          <label
            htmlFor="input-file-json"
            className="inline-block text-sm font-medium text-gray-500 mt-2.5"
          >
            {i18n.t("Upload .json file")}
          </label>

          <div>
            <label
              htmlFor="input-file-json hover:cursor-pointer"
              className="sr-only"
            >
              {i18n.t("Choose file")}
            </label>
            <input
              type="file"
              name="input-file-json"
              id="input-file-json"
              accept="application/JSON"
              onInput={handleFile}
              className="hover:cursor-pointer block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 file:border-0 file:bg-gray-100 file:me-4 file:py-2 file:px-3 dark:file:bg-gray-700 dark:file:text-gray-400"
            />
          </div>

          <label
            htmlFor="json-text"
            className="inline-block text-sm font-medium text-gray-500 mt-2.5"
          >
            {i18n.t("or paste the JSON")}
          </label>

          <textarea
            id="json-text"
            className="t-textarea py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
            rows={10}
            placeholder={`{ "Welcome": "Buongiorno" }`}
            onChange={handleChangeTextJSON}
            value={textJSON}
          ></textarea>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              onClick={analyzeKeywords}
              disabled={!textJSON || !languageSelected}
            >
              {i18n.t("Continue")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ImportKeywordsModal
