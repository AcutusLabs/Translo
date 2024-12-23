import { ChangeEvent, useCallback, useContext, useMemo, useState } from "react"
import { languages as allLanguages } from "@/constants/languages"
import { DialogClose } from "@radix-ui/react-dialog"

import { eventPostHogClient, UserDoClientAction } from "@/lib/analytics-client"
import i18n from "@/lib/i18n"
import { useAddLanguage } from "@/hooks/api/project/language/use-add-language"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LanguageSelector } from "@/components/app/project/language-selector"
import { Icons } from "@/components/icons"
import { AlertContext } from "@/app/[lang]/client-providers"

import { LanguageData } from "../types"

type Props = {
  projectId: string
  languages: LanguageData[]
}

const AddNewLanguage = (props: Props) => {
  const { projectId, languages } = props
  const [selectedLanguage, setSelectedLanguage] = useState<string>()

  const [languageName, setLanguageName] = useState<string>("")
  const [shortName, setShortName] = useState<string>("")

  const alertContext = useContext(AlertContext)

  const { mutate: addLanguage } = useAddLanguage({
    projectId: projectId,
    showAlertType: alertContext.showAlert,
  })

  const handleChangeLanguageName = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setLanguageName(e.target.value)
    },
    []
  )

  const handleChangeShortName = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setShortName(e.target.value)
    },
    []
  )

  const reset = useCallback(() => {
    setLanguageName("")
    setShortName("")
    setSelectedLanguage(undefined)
  }, [])

  const onAddLanguage = useCallback(() => {
    if (!selectedLanguage) {
      // The keyword '_id' is a reserved keyword for identifying constant translations
      return
    }

    const language = allLanguages.find((lang) => lang.code === selectedLanguage)

    if (!language) {
      return
    }

    eventPostHogClient(UserDoClientAction.addLanguage, {
      lang: language.englishName,
      short: language.code,
    })

    addLanguage({ name: language.englishName, short: language.code })
    reset()
  }, [addLanguage, reset, selectedLanguage])

  const onAddCustomLanguage = useCallback(() => {
    if (!languageName || !shortName || shortName === "_id") {
      // The keyword '_id' is a reserved keyword for identifying terms
      return
    }

    eventPostHogClient(UserDoClientAction.addLanguage, {
      lang: languageName,
      short: shortName,
    })

    addLanguage({ name: languageName, short: shortName })
    setSelectedLanguage(undefined)
    reset()
  }, [addLanguage, languageName, reset, shortName])

  const isLanguageAlreadyExists = useMemo(
    () => languages.find((lang) => lang.short === shortName) !== undefined,
    [languages, shortName]
  )

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="t-button"
          data-testid="add-new-language-modal-trigger"
        >
          <Icons.add className="h-3.5 w-3.5" />
          {i18n.t("Add language")}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{i18n.t("New language")}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <LanguageSelector
            currentLanguages={languages}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button
                onClick={onAddLanguage}
                disabled={!selectedLanguage}
                data-testid="add-new-language-button"
              >
                {i18n.t("Add language")}
              </Button>
            </DialogClose>
          </DialogFooter>
          <div>{i18n.t("You can't find a language? create it!")}</div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="languageName" className="text-right">
              {i18n.t("Name")}
            </Label>
            <Input
              id="languageName"
              placeholder="English"
              className="col-span-3"
              data-1p-ignore
              value={languageName}
              onChange={handleChangeLanguageName}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="shortName" className="text-right">
              {i18n.t("Short name (filename)")}
            </Label>
            <Input
              id="shortName"
              placeholder="en"
              className="col-span-3"
              data-1p-ignore
              value={shortName}
              onChange={handleChangeShortName}
            />
          </div>
          {isLanguageAlreadyExists && (
            <h6 className="w-full text-red-500 text-xs">
              {i18n.t("Short name already exists")}
            </h6>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              onClick={onAddCustomLanguage}
              disabled={
                !languageName ||
                !shortName ||
                shortName === "_id" ||
                isLanguageAlreadyExists
              }
            >
              {i18n.t("Add custom language")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddNewLanguage
