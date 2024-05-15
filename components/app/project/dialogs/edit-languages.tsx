import { ChangeEvent, useCallback, useContext, useState } from "react"
import { DialogClose } from "@radix-ui/react-dialog"

import i18n from "@/lib/i18n"
import { useDeleteLanguage } from "@/hooks/api/project/language/use-delete-language"
import { useEditLanguage } from "@/hooks/api/project/language/use-edit-language"
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
import { AlertContext } from "@/app/client-providers"

import { LanguageData } from "../types"

type Props = {
  projectId: string
  disabled: boolean
  language: LanguageData
}

const EditLanguage = (props: Props) => {
  const { projectId, language, disabled } = props

  const [languageName, setLanguageName] = useState(language.name)
  const [shortName, setShortName] = useState(language.short)

  const alertContext = useContext(AlertContext)

  const { mutate: editLanguage } = useEditLanguage({
    projectId: projectId,
    languageId: language.id,
    languageProps: {
      short: shortName,
      name: languageName,
    },
    showAlertType: alertContext.showAlert,
  })

  const { mutate: deleteLanguage } = useDeleteLanguage({
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
  }, [])

  const onSubmit = useCallback(() => {
    editLanguage()
    reset()
  }, [editLanguage, reset])

  const languageTitle = `[${language.short}] ${language.name}`

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="t-button" disabled={disabled}>
          {languageTitle}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {i18n.t("Edit language: {language}", {
              language: language.name,
            })}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
        </div>
        <DialogFooter className="sm:justify-between">
          <DialogClose asChild>
            <Button
              type="button"
              variant="destructive"
              className="mt-4 sm:mt-0"
              onClick={() => {
                deleteLanguage(language.id)
              }}
            >
              {i18n.t("Delete")}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={onSubmit}>{i18n.t("Edit language")}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditLanguage
