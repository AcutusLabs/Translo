import { useCallback, useState } from "react"
import { DialogClose } from "@radix-ui/react-dialog"

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
          <svg
            className="h-3.5 w-3.5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            />
          </svg>
          Add word
        </button>
      </DialogTrigger>
      <DialogContent className="relative sm:max-w-[425px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>New constant word</DialogTitle>
          <DialogDescription>
            Write the word you want to be preferred over other similar words in
            the languages you prefer
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[52vh] grid gap-4 py-4 overflow-y-scroll pr-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="identifier" className="text-right">
              Identifier
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
              Add word
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddNewConstantTranslation
