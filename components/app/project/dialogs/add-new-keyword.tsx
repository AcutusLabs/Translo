import {
  ChangeEvent,
  FormEvent,
  Fragment,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
import { DialogClose } from "@radix-ui/react-dialog"
import { TooltipPortal } from "@radix-ui/react-tooltip"

import i18n from "@/lib/i18n"
import { useAddKeyword } from "@/hooks/api/project/keyword/use-add-keyword"
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
import { AlertContext } from "@/app/[lang]/client-providers"

import { KeywordData } from "../types"

export type NewKeyword = {
  key: string
  context: string
}

type Props = {
  projectId: string
  keywords: KeywordData[]
}

const AddNewKeyword = (props: Props) => {
  const { projectId, keywords } = props
  const [open, setOpen] = useState(false)

  const [key, setKey] = useState<string>("")
  const [context, setContext] = useState<string>("")

  const alertContext = useContext(AlertContext)

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
    setKey("")
    setContext("")
  }, [])

  const { isPending, mutate } = useAddKeyword({
    projectId: projectId,
    keywordProps: {
      keyword: key,
      context,
    },
    onSuccess: () => {
      setOpen(false)
      reset()
    },
    showAlertType: alertContext.showAlert,
  })

  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      if (!key) {
        return
      }

      mutate()
    },
    [key, mutate]
  )

  const isKeywordAlreadyExists = useMemo(
    () => keywords.find((keyword) => keyword.keyword === key) !== undefined,
    [key, keywords]
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="add-new-keyword-modal-trigger">
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
                data-testid="add-new-keyword-input"
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
                            "You can provide this context alongside the keyword; it's optional and helps the AI in its translation process"
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
                data-testid="add-new-keyword-button"
              >
                {isPending ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Fragment />
                )}
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
