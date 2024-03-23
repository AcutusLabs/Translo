import { ChangeEvent, FormEvent, useCallback, useMemo, useState } from "react"
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
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Icons } from "@/components/icons"

import { Keyword } from "../useTranslation"

export type NewKeyword = {
  key: string
  context: string
}

type Props = {
  keywords: Keyword[]
  addKeyword: (newKey: NewKeyword) => void
}

const AddNewKeyword = (props: Props) => {
  const { keywords, addKeyword } = props
  const [open, setOpen] = useState(false)

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

  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      if (!key) {
        return
      }

      addKeyword({
        key,
        context,
      })
      setOpen(false)
      reset()
    },
    [addKeyword, context, key, reset]
  )

  const isKeywordAlreadyExists = useMemo(
    () => keywords.find((keyword) => keyword.key === key) !== undefined,
    [key, keywords]
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Icons.add className="mr-2 h-3.5 w-3.5" />
          {i18n.t("Add keyword")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
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
            {isKeywordAlreadyExists && (
              <h6 className="w-full text-red-500 text-xs">
                {i18n.t("Keyword already exists")}
              </h6>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="username"
                className="text-right flex items-center gap-2"
              >
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
                          __html: i18n.t(
                            "This context is optional and can be provided alongside the keyword, aiding the AI in its translation process."
                          ),
                        }}
                      ></div>
                    </TooltipContent>
                  </TooltipPortal>
                </Tooltip>
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
              <Button
                onClick={onSubmit}
                disabled={!key || isKeywordAlreadyExists}
              >
                {i18n.t("Add keyword")}
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddNewKeyword
