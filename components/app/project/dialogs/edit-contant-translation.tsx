import { ConstantTranslations } from "@/store/useI18nState"
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
  languages: string[]
  word: ConstantTranslations
  editWord: (word: ConstantTranslations) => void
  deleteWord: (id: string) => void
}

const EditConstantTranslation = (props: Props) => {
  const { word, languages } = props

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="t-button">{word._id}</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit word: {word._id}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="languageName" className="text-right">
              Identifier
            </Label>
            <Input
              id="languageName"
              placeholder="English"
              className="col-span-3"
              data-1p-ignore
              value={word._id}
              onChange={() => {}}
            />
          </div>
          {languages.map((language) => (
            <div key={language} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="languageName" className="text-right">
                {language}
              </Label>
              <Input
                id="languageName"
                placeholder={`translation in ${language} if you needed`}
                className="col-span-3"
                data-1p-ignore
                value={word[language]}
                onChange={() => {}}
              />
            </div>
          ))}
        </div>
        <DialogFooter className="sm:justify-between">
          <DialogClose asChild>
            <Button
              type="button"
              variant="destructive"
              className="mt-4 sm:mt-0"
              onClick={() => {}}
            >
              Delete
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={() => {}}>Edit word</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditConstantTranslation
