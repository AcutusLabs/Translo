"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { DialogClose } from "@radix-ui/react-dialog"

import i18n from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

const AddNewProject = () => {
  const [projectName, setProjectName] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const router = useRouter()

  const addProject = useCallback(async () => {
    setIsLoading(true)

    const response = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: projectName,
      }),
    })

    setIsLoading(false)

    if (!response?.ok) {
      if (response.status === 402) {
        return toast({
          title: "Limit of 1 project reached.",
          description: "Please upgrade to the PRO plan.",
          variant: "destructive",
        })
      }

      return toast({
        title: "Something went wrong.",
        description: "Your project was not created. Please try again.",
        variant: "destructive",
      })
    }
    const project = await response.json()

    router.refresh()

    router.push(`/editor/${project.id}`)
  }, [projectName, router])

  const createProject = useCallback(() => {
    addProject()
    setProjectName("")
  }, [addProject])

  const handleProjectName = useCallback(
    (e) => setProjectName(e.target.value),
    []
  )

  const onOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setProjectName("")
    }
  }, [])

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button
          className={cn(buttonVariants(), {
            "cursor-not-allowed opacity-60": isLoading,
          })}
          disabled={isLoading}
        >
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.add className="mr-2 h-4 w-4" />
          )}
          {i18n.t("New project")}
        </button>
      </DialogTrigger>
      <DialogContent className="relative sm:max-w-[425px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>
            <div className="capitalize">{i18n.t("New project")}</div>
          </DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <Input
            placeholder={i18n.t("Project name")}
            className="col-span-3"
            data-1p-ignore
            value={projectName}
            onChange={handleProjectName}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={createProject} disabled={!projectName}>
              {i18n.t("Create")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddNewProject
