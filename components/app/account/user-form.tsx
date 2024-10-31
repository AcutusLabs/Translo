"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@prisma/client"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import i18n from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { userNameSchema } from "@/lib/validations/user"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import LanguageSelector from "@/components/ui/language-selector"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

import ChangeEmailDialog from "./dialogs/change-email"
import ChangePasswordDialog from "./dialogs/change-password"

interface UserFormProps extends React.HTMLAttributes<HTMLFormElement> {
  user: Pick<User, "id" | "name" | "email" | "lang">
}

type FormData = z.infer<typeof userNameSchema>

export function UserForm({ user, className, ...props }: UserFormProps) {
  const router = useRouter()

  const { update } = useSession()

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userNameSchema),
    defaultValues: {
      name: user?.name || "",
      lang: user.lang,
    },
  })
  const lang = watch("lang")
  const [isSaving, setIsSaving] = React.useState<boolean>(false)

  async function onSubmit(data: FormData) {
    setIsSaving(true)

    const response = await fetch(`/api/users/${user.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        lang: data.lang,
      }),
    })

    setIsSaving(false)

    if (!response?.ok) {
      return toast({
        title: i18n.t("Something went wrong"),
        description: i18n.t("Your name was not updated. Please try again"),
        variant: "destructive",
      })
    }

    await update({ name: data.name })

    toast({
      description: i18n.t("Your name has been updated"),
    })

    router.refresh()
  }

  return (
    <form
      className={cn(className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <Card>
        <CardContent>
          <CardTitle className="mb-2 mt-6">{i18n.t("Your Name")}</CardTitle>
          <CardDescription className="mb-2">
            {i18n.t(
              "Please enter your full name or a display name you are comfortable with."
            )}
          </CardDescription>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="name">
              {i18n.t("Name")}
            </Label>
            <Input
              id="name"
              className="w-[400px]"
              size={32}
              {...register("name")}
            />
            {errors?.name && (
              <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>
          <CardTitle className="mb-2 mt-6">{i18n.t("Email")}</CardTitle>
          <ChangeEmailDialog oldEmail={user.email} />
          <CardTitle className="mb-2 mt-6">{i18n.t("Password")}</CardTitle>
          <ChangePasswordDialog />
          <CardTitle className="mb-2 mt-6">{i18n.t("Language")}</CardTitle>
          <LanguageSelector
            languageSelected={lang}
            onChangeLanguage={(lang: string) => {
              setValue("lang", lang)
            }}
          />
        </CardContent>

        <CardFooter>
          <button
            type="submit"
            className={cn(buttonVariants(), className)}
            disabled={isSaving}
          >
            {isSaving && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>{i18n.t("Save")}</span>
          </button>
        </CardFooter>
      </Card>
    </form>
  )
}
