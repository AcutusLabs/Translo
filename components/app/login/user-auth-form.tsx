"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import i18n from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { userAuthSchema } from "@/lib/validations/auth"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

import ForgotPasswordDialog from "./dialogs/forgot-password"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  type: "register" | "login"
}

type FormData = z.infer<typeof userAuthSchema>

export function UserAuthForm({ className, type, ...props }: UserAuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  })
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isGitHubLoading, setIsGitHubLoading] = React.useState<boolean>(false)
  const searchParams = useSearchParams()

  async function onSubmit(data: FormData) {
    setIsLoading(true)

    if (type === "login") {
      const signInResult = await signIn("credentials", {
        email: data.email.toLowerCase(),
        password: data.password.toLowerCase(),
        redirect: false,
        callbackUrl: searchParams?.get("from") || "/dashboard",
      })

      setIsLoading(false)

      if (!signInResult?.ok) {
        return toast({
          title: i18n.t("Something went wrong"),
          description: i18n.t("Your sign in request failed. Please try again"),
          variant: "destructive",
        })
      }

      window.location.reload()
    } else {
      const res = await fetch(`/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email.toLowerCase(),
          password: data.password.toLowerCase(),
        }),
      })

      setIsLoading(false)

      if (!res?.ok) {
        return toast({
          title: i18n.t("Something went wrong"),
          description: i18n.t("Your sign in request failed. Please try again"),
          variant: "destructive",
        })
      }

      return toast({
        title: i18n.t("Check your email"),
        description: i18n.t(
          "We sent you a login link. Be sure to check your spam too"
        ),
      })
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              {i18n.t("Email")}
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              {...register("email")}
            />
            {errors?.email && (
              <p className="px-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              {i18n.t("Password")}
            </Label>
            <Input
              id="password"
              placeholder="password"
              type="password"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
              {...register("password")}
            />
            {errors?.email && (
              <p className="px-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <button className={cn(buttonVariants())} disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {type === "login" ? "Sign In" : "Sign up"}
          </button>
          {type === "login" && <ForgotPasswordDialog />}
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {i18n.t("Or continue with")}
          </span>
        </div>
      </div>
      <button
        type="button"
        className={cn(buttonVariants({ variant: "outline" }))}
        onClick={() => {
          setIsGitHubLoading(true)
          signIn("github")
        }}
        disabled={isLoading || isGitHubLoading}
      >
        {isGitHubLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
          // eslint-disable-next-line react/jsx-no-literals
        )}{" "}
        Github
      </button>
    </div>
  )
}
