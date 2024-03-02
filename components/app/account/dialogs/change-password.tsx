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
import { toast } from "@/components/ui/use-toast"
import { changePassword } from "@/app/api/users/utils"

export type NewChangePassword = {
  old: string
  new: string
}

type ChangePasswordDialogProps = {
  id: string
}

const ChangePasswordDialog = (props: ChangePasswordDialogProps) => {
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
    try {
      const result = await changePassword(props.id, {
        old: oldPassword,
        new: newPassword,
      })

      if (!result.count) {
        return toast({
          title: "Wrong password",
          description: "The password does not match. Please try again.",
          variant: "destructive",
        })
      }
    } catch (e) {
      return toast({
        title: "Something went wrong.",
        description: "Changing password failed. Please try again.",
        variant: "destructive",
      })
    }

    return toast({
      title: "Password changed",
      description: "The password has been updated successfully.",
    })
  }, [newPassword, oldPassword, props.id, reset])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-lock"
          >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Change password
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
          <DialogDescription>
            Enter the old and the new password
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Old
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
              New
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
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ChangePasswordDialog
