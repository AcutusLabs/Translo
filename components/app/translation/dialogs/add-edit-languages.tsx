import { ChangeEvent, useCallback, useState } from "react"
import { EditLanguageType, Language } from "@/store/useI18nState"
import { DialogClose } from "@radix-ui/react-dialog"

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

type Props = {
  language: Language
  editLanguage: (language: EditLanguageType) => void
  deleteLanguage: (language: Language) => void
}

const EditLanguage = (props: Props) => {
  const { language, editLanguage, deleteLanguage } = props

  const [languageName, setLanguageName] = useState(language.lang)
  const [shortName, setShortName] = useState(language.short)

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
    editLanguage({
      exShortName: language.short,
      lang: languageName,
      short: shortName,
    })
    reset()
  }, [editLanguage, language.short, languageName, reset, shortName])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="t-button">
          [{language.short}] {language.lang}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit language: {language.lang}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
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
            <Label htmlFor="username" className="text-right">
              Short name (filename)
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
                deleteLanguage(language)
              }}
            >
              Delete
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={onSubmit}>Edit language</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditLanguage
