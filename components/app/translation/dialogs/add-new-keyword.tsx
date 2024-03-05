import { ChangeEvent, useCallback, useState } from "react"
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

export type NewKeyword = {
  key: string
  context: string
}

type Props = {
  addKeyword: (newKey: NewKeyword) => void
}

const AddNewKeyword = (props: Props) => {
  const { addKeyword } = props

  const [key, setKey] = useState<string | undefined>(undefined)
  const [context, setContext] = useState<string | undefined>(undefined)

  const handleChangeKey = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setKey(e.target.value)
  }, [])

  const handleChangeDescription = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setContext(e.target.value)
    },
    []
  )

  const reset = useCallback(() => {
    setKey(undefined)
    setContext(undefined)
  }, [])

  const onSubmit = useCallback(() => {
    if (!key || !context) {
      return
    }

    addKeyword({
      key,
      context,
    })
    reset()
  }, [addKeyword, context, key, reset])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <svg
            className="mr-2 h-3.5 w-3.5"
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
          Add keyword
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New keyword</DialogTitle>
          <DialogDescription>
            Translate the sentence into the languages you need
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="keyword" className="text-right">
              Keyword
            </Label>
            <Input
              id="keyword"
              placeholder="app.welcome"
              className="col-span-3"
              data-1p-ignore
              value={key}
              onChange={handleChangeKey}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              placeholder="used in the registration email"
              className="col-span-3"
              data-1p-ignore
              value={context}
              onChange={handleChangeDescription}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={onSubmit} disabled={!key || !context}>
              Add keyword
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddNewKeyword
