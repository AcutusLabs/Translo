"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Translation } from "@prisma/client"
import { useForm } from "react-hook-form"
import TextareaAutosize from "react-textarea-autosize"
import * as z from "zod"

import "@/styles/editor.css"
import { VStack } from "@chakra-ui/react"

import { cn } from "@/lib/utils"
import { translationPatchSchema } from "@/lib/validations/translation"
import { buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { MainTable } from "@/components/translation/main-table"

interface EditorProps {
  translation: Pick<Translation, "id" | "title" | "content" | "published">
}

type FormData = z.infer<typeof translationPatchSchema>

export function Editor({ translation }: EditorProps) {
  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(translationPatchSchema),
  })
  const router = useRouter()
  const [isSaving, setIsSaving] = React.useState<boolean>(false)

  async function onSubmit(data: FormData) {
    setIsSaving(true)

    const response = await fetch(`/api/translations/${translation.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: data.title,
        content: { i18n: "i18n" },
      }),
    })

    setIsSaving(false)

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Your translation was not saved. Please try again.",
        variant: "destructive",
      })
    }

    router.refresh()

    return toast({
      description: "Your translation has been saved.",
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid w-full gap-10">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center space-x-10">
            <Link
              href="/dashboard"
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              <>
                <Icons.chevronLeft className="mr-2 h-4 w-4" />
                Back
              </>
            </Link>
            <p className="text-sm text-muted-foreground">
              {translation.published ? "Published" : "Draft"}
            </p>
          </div>
          <button type="submit" className={cn(buttonVariants())}>
            {isSaving && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>Save</span>
          </button>
        </div>
        <div className="prose prose-stone mx-auto max-w-[1200px] dark:prose-invert">
          <TextareaAutosize
            autoFocus
            id="title"
            defaultValue={translation.title}
            placeholder="Translation name"
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
            {...register("title")}
          />
          <VStack h={"100vh"} align={"stretch"}>
            <VStack flex={1} overflow={"auto"}>
              <MainTable />
            </VStack>
          </VStack>
        </div>
      </div>
    </form>
  )
}
