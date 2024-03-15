import { useCallback, useState } from "react"
import { DialogClose } from "@radix-ui/react-dialog"

import i18n from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"

export type NewConstantTranslation = {
  _id: string
  [language: string]: string
}

type Props = {
  languages: string[]
  addContantTranslation: (newWord: NewConstantTranslation) => void
}

const AddNewConstantTranslation = (props: Props) => {
  const { languages, addContantTranslation } = props

  const [translations, setTranslation] = useState<NewConstantTranslation>({
    _id: "",
  })

  const reset = useCallback(() => {
    setTranslation({
      _id: "",
    })
  }, [])

  const onSubmit = useCallback(() => {
    addContantTranslation(translations)
    reset()
  }, [addContantTranslation, reset, translations])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="t-button">
          <Icons.add className="h-3.5 w-3.5" />
          {i18n.t("Add term")}
        </button>
      </DialogTrigger>
      <DialogContent className="relative sm:max-w-[425px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{i18n.t("New term")}</DialogTitle>
          <DialogDescription>
            {i18n.t(
              "Write the word you want to be preferred over other similar words in the languages you prefer"
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[52vh] grid gap-4 py-4 overflow-y-scroll pr-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="identifier" className="text-right">
              {i18n.t("Identifier")}
            </Label>
            <Input
              id="identifier"
              placeholder="subscription"
              className="col-span-3"
              data-1p-ignore
              value={translations._id}
              onChange={(event) => {
                setTranslation((old) => ({
                  ...old,
                  _id: event.target.value,
                }))
              }}
            />
          </div>
          {languages.map((language) => (
            <div key={language} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="language" className="text-right">
                {language}
              </Label>
              <Input
                id="language"
                placeholder={`translation in ${language} if you needed`}
                className="col-span-3"
                data-1p-ignore
                value={translations[language]}
                onChange={(event) => {
                  setTranslation((old) => ({
                    ...old,
                    [language]: event.target.value,
                  }))
                }}
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              onClick={onSubmit}
              disabled={
                translations._id === "" ||
                Object.keys(translations).filter(
                  (key) => key !== "_id" && translations[key] !== ""
                ).length === 0
              }
            >
              {i18n.t("Add term")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddNewConstantTranslation
