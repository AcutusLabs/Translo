import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react"
import { I18nLang } from "@/store/useI18nState"

import i18n from "@/lib/i18n"
import { cn, isJson } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"

import SelectLanguage from "../select-language"
import { Keyword } from "../useTranslation"

export type ImportKeywords = {
  [key: string]: string
}

export type KeywordsToOverwrite = {
  [key: string]: { old: string; new: string; selected: boolean }
}

type ImportKeywordsModalProps = {
  keywords: Keyword[]
  languages: I18nLang[]
  importKeys: (keywords: ImportKeywords, languageRef: string) => void
}

const ImportKeywordsModal = (props: ImportKeywordsModalProps) => {
  const { keywords, languages, importKeys } = props

  const [textJSON, setTextJSON] = useState("")
  const [languageSelected, selectLanguage] = useState<I18nLang | undefined>(
    undefined
  )

  const [open, setOpen] = useState(false)

  const [keywordsToOverwrite, setKeywordsToOverwrite] =
    useState<KeywordsToOverwrite>({})

  const handleChangeTextJSON = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setTextJSON(e.target.value)
    },
    []
  )

  useEffect(() => {
    if (languages.length === 1) {
      selectLanguage(languages[0])
    }
  }, [languages, languages.length, open])

  const reset = useCallback(() => {
    selectLanguage(undefined)
    setTextJSON("")
    setKeywordsToOverwrite({})
  }, [])

  const onOpenChange = useCallback(
    (_open: boolean) => {
      setOpen(_open)
      if (_open) {
        reset()
      }
    },
    [reset]
  )

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

  const selectKeywordToOverwrite = useCallback(
    (key: string, selected: boolean) => {
      setKeywordsToOverwrite({
        ...keywordsToOverwrite,
        [key]: {
          ...keywordsToOverwrite[key],
          selected,
        },
      })
    },
    [keywordsToOverwrite]
  )

  const selectAllKeywordToOverwrite = useCallback(() => {
    const newKeywordsToOverwrite = { ...keywordsToOverwrite }

    Object.keys(newKeywordsToOverwrite).forEach((key) => {
      newKeywordsToOverwrite[key].selected = true
    })
    setKeywordsToOverwrite(newKeywordsToOverwrite)
  }, [keywordsToOverwrite])

  const deselectAllKeywordToOverwrite = useCallback(() => {
    const newKeywordsToOverwrite = { ...keywordsToOverwrite }

    Object.keys(newKeywordsToOverwrite).forEach((key) => {
      newKeywordsToOverwrite[key].selected = false
    })
    setKeywordsToOverwrite(newKeywordsToOverwrite)
  }, [keywordsToOverwrite])

  const numbersOfKeywordsToOverwrite = useMemo(
    () =>
      Object.keys(keywordsToOverwrite).filter(
        (key) => keywordsToOverwrite[key].selected
      ).length,
    [keywordsToOverwrite]
  )

  const analyzeKeywords = useCallback(() => {
    if (!languageSelected) {
      return
    }

    try {
      const jsonData = JSON.parse(textJSON)

      const keywordsAlreadyExists = keywords.filter(
        (keyword) => jsonData[keyword.key] !== undefined
      )

      if (keywordsAlreadyExists.length) {
        setKeywordsToOverwrite(
          keywordsAlreadyExists.reduce(
            (acc, keyword): KeywordsToOverwrite => ({
              ...acc,
              [keyword.key]: {
                new: jsonData[keyword.key],
                old: languageSelected.keywords[keyword.key],
                selected: false,
              },
            }),
            {}
          )
        )
        return
      }

      importKeys(jsonData, languageSelected.short)
      reset()
      setOpen(false)
    } catch (error) {
      toast({
        title: i18n.t("Something went wrong"),
        description: i18n.t("Error parsing JSON"),
        variant: "destructive",
      })
    }
  }, [importKeys, keywords, languageSelected, reset, textJSON])

  const overwrtieKeywords = useCallback(() => {
    if (!languageSelected) {
      return
    }

    try {
      const jsonData = JSON.parse(textJSON) as ImportKeywords

      const keywordsToSave = Object.keys(jsonData).filter((keywordToImport) => {
        const keywordToCheck = keywordsToOverwrite[keywordToImport]
        return !keywordToCheck || keywordToCheck.selected
      })

      const jsonToSave = keywordsToSave.reduce(
        (acc, keywordToSave) => ({
          ...acc,
          [keywordToSave]: jsonData[keywordToSave],
        }),
        {}
      )

      importKeys(jsonToSave, languageSelected.short)
      reset()
      setOpen(false)
    } catch (error) {
      toast({
        title: i18n.t("Something went wrong"),
        description: i18n.t("Error parsing JSON"),
        variant: "destructive",
      })
    }
  }, [importKeys, keywordsToOverwrite, languageSelected, reset, textJSON])

  const InputKeywordsView = useMemo(() => {
    return (
      <div className="flex flex-col gap-3">
        <SelectLanguage
          languageSelected={languageSelected?.short}
          languages={languages}
          onChangeLanguage={(lang) => {
            selectLanguage(
              languages.find((language) => language.short === lang)
            )
          }}
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

        {!isJson(textJSON) && textJSON && (
          <h6 className="w-full text-red-500 text-xs">
            {i18n.t("Invalid JSON")}
          </h6>
        )}

        <DialogFooter>
          <Button
            onClick={analyzeKeywords}
            disabled={!textJSON || !languageSelected || !isJson(textJSON)}
          >
            {i18n.t("Continue")}
          </Button>
        </DialogFooter>
      </div>
    )
  }, [
    analyzeKeywords,
    handleChangeTextJSON,
    handleFile,
    languageSelected,
    languages,
    textJSON,
  ])

  const OverwrtieKeywordsView = useMemo(() => {
    return (
      <div className="flex flex-col gap-3">
        <label
          htmlFor="json-text"
          className="inline-block text-sm font-medium text-gray-500 mt-2.5 mb-4"
        >
          {i18n.t("Select the keywords you want to replace")}
        </label>

        <div className="flex row gap-3">
          <button className="t-button" onClick={selectAllKeywordToOverwrite}>
            {i18n.t("Select all")}
          </button>
          <button className="t-button" onClick={deselectAllKeywordToOverwrite}>
            {i18n.t("Deselect all")}
          </button>
        </div>
        <div className="max-h-[39vh] grid gap-4 py-4 overflow-y-scroll pr-2">
          {Object.keys(keywordsToOverwrite).map((key, index) => (
            <div key={key}>
              <label htmlFor={key} className="items-top flex space-x-2">
                <Checkbox
                  id={key}
                  checked={keywordsToOverwrite[key].selected}
                  onCheckedChange={(checked) => {
                    selectKeywordToOverwrite(key, !!checked)
                  }}
                />
                <div className="grid gap-1.5 leading-none">
                  <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {key}
                  </p>
                  <p className="text-sm text-muted-foreground line-through">
                    {keywordsToOverwrite[key].old}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {keywordsToOverwrite[key].new}
                  </p>
                </div>
              </label>
              {index < Object.keys(keywordsToOverwrite).length - 1 && (
                <Separator className="my-4" />
              )}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button
            onClick={overwrtieKeywords}
            disabled={!textJSON || !languageSelected || !isJson(textJSON)}
          >
            {numbersOfKeywordsToOverwrite > 0
              ? i18n.t("Import and overwrite {number} keywords", {
                  number: numbersOfKeywordsToOverwrite,
                })
              : i18n.t("Import without overwriting anything")}
          </Button>
        </DialogFooter>
      </div>
    )
  }, [
    deselectAllKeywordToOverwrite,
    keywordsToOverwrite,
    languageSelected,
    numbersOfKeywordsToOverwrite,
    overwrtieKeywords,
    selectAllKeywordToOverwrite,
    selectKeywordToOverwrite,
    textJSON,
  ])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button
          className={cn(buttonVariants({ variant: "secondary" }), "mr-4")}
        >
          <span>{i18n.t("Import")}</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{i18n.t("Import keywords")}</DialogTitle>
          <DialogDescription>
            {i18n.t("project.Import keywords.description")}
          </DialogDescription>
        </DialogHeader>
        {Object.keys(keywordsToOverwrite).length
          ? OverwrtieKeywordsView
          : InputKeywordsView}
      </DialogContent>
    </Dialog>
  )
}

export default ImportKeywordsModal
