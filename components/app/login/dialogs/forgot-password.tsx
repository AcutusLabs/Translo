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
import { forgotPassword } from "@/app/api/users/utils"

const ForgotPasswordDialog = () => {
  const [email, setEmail] = useState("")

  const handleChangeEmail = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }, [])

  const reset = useCallback(() => {
    setEmail("")
  }, [])

  const onSubmit = useCallback(async () => {
    try {
      await forgotPassword(email)
    } catch (e) {
      return toast({
        title: "Something went wrong.",
        description: "Please try again.",
        variant: "destructive",
      })
    }

    reset()
    return toast({
      title: "Check your email",
      description:
        "We sent you a reset password link. Be sure to check your spam too.",
    })
  }, [email, reset])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <p className="hover:cursor-pointer hover:text-brand underline underline-offset-4 text-sm text-muted-foreground">
          Forgot password
        </p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Forgot password</DialogTitle>
          <DialogDescription>
            Enter your email here, and we will send you a link where you can
            reset your password
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              placeholder="example@gmail.com"
              className="col-span-3"
              type="email"
              data-1p-ignore
              value={email}
              onChange={handleChangeEmail}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={onSubmit} disabled={!email}>
              Send
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ForgotPasswordDialog
