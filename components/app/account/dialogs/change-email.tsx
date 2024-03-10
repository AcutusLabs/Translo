import { ChangeEvent, Fragment, useCallback, useState } from "react"
import { DialogClose } from "@radix-ui/react-dialog"

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
        title: "Something went wrong.",
        variant: "destructive",
      })
    }

    reset()
    try {
      await changeEmail(props.oldEmail, newEmail)
    } catch (e) {
      return toast({
        title: "Something went wrong.",
        description: "Changing password failed. Please try again.",
        variant: "destructive",
      })
    }

    return toast({
      title: "Check your email",
      description:
        "We sent you a change email link. Be sure to check your spam too.",
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
          className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
        >
          <Icons.email />
          Change email
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change email</DialogTitle>
          <DialogDescription>Enter the new email</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              New
            </Label>
            <Input
              id="email"
              placeholder="new email"
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
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ChangeEmailDialog
