import { ChangeEvent, useCallback, useState } from "react"
import { DialogClose } from "@radix-ui/react-dialog"
import { TooltipPortal } from "@radix-ui/react-tooltip"

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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Icons } from "@/components/icons"

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
  const [context, setContext] = useState<string>("")

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
    setContext("")
  }, [])

  const onSubmit = useCallback(() => {
    if (!key) {
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
          <Icons.add className="mr-2 h-3.5 w-3.5" />
          {i18n.t("Add keyword")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{i18n.t("New keyword")}</DialogTitle>
          <DialogDescription>
            {i18n.t("Translate the sentence into the languages you need")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="keyword" className="text-right">
              {i18n.t("Keyword")}
            </Label>
            <Input
              id="keyword"
              placeholder={i18n.t("Keyword to translate")}
              className="col-span-3"
              data-1p-ignore
              value={key}
              onChange={handleChangeKey}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="username"
              className="text-right flex items-center gap-2"
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="IconButton">
                      <Icons.info size={20} />
                    </button>
                  </TooltipTrigger>
                  <TooltipPortal>
                    <TooltipContent sideOffset={3} className="w-60">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: i18n.t("Context tooltip description"),
                        }}
                      ></div>
                    </TooltipContent>
                  </TooltipPortal>
                </Tooltip>
              </TooltipProvider>
              {i18n.t("Context")}
            </Label>
            <Input
              id="description"
              placeholder={i18n.t("Context for the keyword")}
              className="col-span-3"
              data-1p-ignore
              value={context}
              onChange={handleChangeDescription}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={onSubmit} disabled={!key}>
              {i18n.t("Add keyword")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddNewKeyword
