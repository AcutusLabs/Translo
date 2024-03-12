/* eslint-disable @next/next/no-img-element */
import Link from "next/link"

import i18n from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { UserAuthForm } from "@/components/app/login/user-auth-form"
import { Icons } from "@/components/icons"

export const metadata = {
  title: "Create an account",
  description: "Create an account to get started.",
}

export default function RegisterPage() {
  return (
    <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 md:right-8 md:top-8"
        )}
      >
        {i18n.t("Login")}
      </Link>
      <div className="hidden h-screen lg:block">
        <img
          className="w-full h-screen object-cover"
          src="https://images.unsplash.com/photo-1533226458520-6f71cffeaa6a?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Image Description"
        />
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <Icons.logo className="mx-auto h-6 w-6" />
            <h1 className="text-2xl font-semibold tracking-tight">
              {i18n.t("Create an account")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {i18n.t("Enter your email below to create your account")}
            </p>
          </div>
          <UserAuthForm type="register" />
          <p className="px-8 text-center text-sm text-muted-foreground">
            {i18n.t("By clicking continue, you agree to our")}{" "}
            <Link
              href="/terms"
              className="hover:text-brand underline underline-offset-4"
            >
              {i18n.t("Terms of Service")}
            </Link>{" "}
            {i18n.t("and")}{" "}
            <Link
              href="/privacy"
              className="hover:text-brand underline underline-offset-4"
            >
              {i18n.t("Privacy Policy")}
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
