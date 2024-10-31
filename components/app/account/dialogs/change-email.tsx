import { ChangeEvent, Fragment, useCallback, useState } from "react"
import { DialogClose } from "@radix-ui/react-dialog"

import i18n from "@/lib/i18n"
import { isEmail } from "@/lib/regex"
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
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { changeEmail } from "@/app/api/users/utils"

type ChangeEmailDialogProps = {
  oldEmail?: string
}

const ChangeEmailDialog = (props: ChangeEmailDialogProps) => {
  const [newEmail, setNewEmail] = useState("")

  const handleChangeNewEmail = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setNewEmail(e.target.value)
    },
    []
  )

  const reset = useCallback(() => {
    setNewEmail("")
  }, [])

  const onSubmit = useCallback(async () => {
    if (!props.oldEmail) {
      return toast({
        title: i18n.t("Something went wrong"),
        variant: "destructive",
      })
    }

    reset()
    try {
      await changeEmail(props.oldEmail, newEmail)
    } catch (e) {
      return toast({
        title: i18n.t("Something went wrong"),
        description: i18n.t("Changing password failed. Please try again"),
        variant: "destructive",
      })
    }

    return toast({
      title: i18n.t("Check your email"),
      description: i18n.t(
        "We sent you a change email link. Be sure to check your spam too"
      ),
    })
  }, [newEmail, props.oldEmail, reset])

  if (!props.oldEmail) {
    return <Fragment />
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-slate-900 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
        >
          <Icons.email />
          {i18n.t("Change email")}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{i18n.t("Change email")}</DialogTitle>
          <DialogDescription>{i18n.t("Enter the new email")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              {i18n.t("New")}
            </Label>
            <Input
              id="email"
              placeholder={i18n.t("New email")}
              className="col-span-3"
              type="email"
              data-1p-ignore
              value={newEmail}
              onChange={handleChangeNewEmail}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              onClick={onSubmit}
              disabled={!newEmail || !isEmail(newEmail)}
            >
              {i18n.t("Save")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ChangeEmailDialog
