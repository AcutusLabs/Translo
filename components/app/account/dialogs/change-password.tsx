import { ChangeEvent, useCallback, useState } from "react"
import { DialogClose } from "@radix-ui/react-dialog"

import { HTTP_POST, HTTP_POST_PATH } from "@/lib/api"
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
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

const ChangePasswordDialog = () => {
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")

  const handleChangeOldPassword = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setOldPassword(e.target.value)
    },
    []
  )

  const handleChangeNewPassword = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setNewPassword(e.target.value)
    },
    []
  )

  const reset = useCallback(() => {
    setOldPassword("")
    setNewPassword("")
  }, [])

  const onSubmit = useCallback(async () => {
    reset()

    await HTTP_POST(
      HTTP_POST_PATH.changePassword,
      JSON.stringify({
        oldPassword,
        newPassword,
      })
    )

    return toast({
      title: i18n.t("Password changed"),
      description: i18n.t("The password has been updated successfully"),
    })
  }, [newPassword, oldPassword, reset])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
        >
          <Icons.password />
          {i18n.t("Change password")}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{i18n.t("Change password")}</DialogTitle>
          <DialogDescription>
            {i18n.t("Enter the old and the new password")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              {i18n.t("Old")}
            </Label>
            <Input
              id="old-password"
              placeholder="old password"
              className="col-span-3"
              type="password"
              data-1p-ignore
              value={oldPassword}
              onChange={handleChangeOldPassword}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              {i18n.t("New")}
            </Label>
            <Input
              id="new-password"
              placeholder="new password"
              className="col-span-3"
              type="password"
              data-1p-ignore
              value={newPassword}
              onChange={handleChangeNewPassword}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={onSubmit} disabled={!oldPassword || !newPassword}>
              {i18n.t("Save")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ChangePasswordDialog
