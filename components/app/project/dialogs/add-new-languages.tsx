import { ChangeEvent, useCallback, useState } from "react"
import { Language } from "@/store/useI18nState"
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
import { Icons } from "@/components/icons"

type Props = {
  addLanguage: (language: Language) => void
}

const AddNewLanguage = (props: Props) => {
  const { addLanguage } = props

  const [languageName, setLanguageName] = useState<string | undefined>(
    undefined
  )
  const [shortName, setShortName] = useState<string | undefined>(undefined)

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
    setLanguageName(undefined)
    setShortName(undefined)
  }, [])

  const onSubmit = useCallback(() => {
    if (!languageName || !shortName || shortName === "_id") {
      // The keyword '_id' is a reserved keyword for identifying constant translations
      return
    }

    addLanguage({
      lang: languageName,
      short: shortName,
    })
    reset()
  }, [addLanguage, languageName, reset, shortName])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="t-button">
          <Icons.add className="h-3.5 w-3.5" />
          Add language
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New language</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="languageName" className="text-right">
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
            <Label htmlFor="shortName" className="text-right">
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
        <DialogFooter>
          <DialogClose asChild>
            <Button
              onClick={onSubmit}
              disabled={!languageName || !shortName || shortName === "_id"}
            >
              Add language
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddNewLanguage
