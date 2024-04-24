import { DialogClose } from "@radix-ui/react-dialog"

import i18n from "@/lib/i18n"
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

import { Term } from "../types"

type Props = {
  languages: string[]
  term: Term
  editWord: (term: Term) => void
  deleteWord: (id: string) => void
}

const EditTerm = (props: Props) => {
  const { term, languages } = props

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="t-button">{term._id}</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {i18n.t("Edit word: {keyword}", { keyword: term._id })}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="languageName" className="text-right">
              {i18n.t("Identifier")}
            </Label>
            <Input
              id="languageName"
              placeholder="English"
              className="col-span-3"
              data-1p-ignore
              value={term._id}
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
                value={term[language]}
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
              {i18n.t("Delete")}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={() => {}}>{i18n.t("Edit term")}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditTerm
