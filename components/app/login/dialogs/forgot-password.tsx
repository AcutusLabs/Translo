import { ChangeEvent, useCallback, useState } from "react"
import { DialogClose } from "@radix-ui/react-dialog"

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
import { forgotPassword } from "@/app/[lang]/api/users/utils"

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
        title: i18n.t("Something went wrong"),
        description: i18n.t("Please try again"),
        variant: "destructive",
      })
    }

    reset()
    return toast({
      title: i18n.t("Check your email"),
      description: i18n.t(
        "We sent you a reset password link. Be sure to check your spam too"
      ),
    })
  }, [email, reset])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <p className="hover:cursor-pointer hover:text-brand underline underline-offset-4 text-sm text-muted-foreground">
          {i18n.t("Forgot password")}
        </p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{i18n.t("Forgot password")}</DialogTitle>
          <DialogDescription>
            {i18n.t(
              "Enter your email here, and we will send you a link where you can reset your password"
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              {i18n.t("Email")}
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
              {i18n.t("Send")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ForgotPasswordDialog
