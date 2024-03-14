"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { DialogClose } from "@radix-ui/react-dialog"

import i18n from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { useAddProject } from "@/hooks/use-add-project"
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
import { Icons } from "@/components/icons"

const AddNewProject = () => {
  const [projectName, setProjectName] = useState<string>("")
  const router = useRouter()

  const { isPending, mutate } = useAddProject({
    projectName,
    onSuccess: (project) => {
      router.refresh()
      router.push(`/editor/${project.id}`)
      setProjectName("")
    },
  })

  const createProject = useCallback(() => mutate(), [mutate])

  const handleProjectName = useCallback(
    (e) => setProjectName(e.target.value),
    []
  )

  const onOpenChange = useCallback((open: boolean) => {
    if (open) {
      setProjectName("")
    }
  }, [])

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button
          className={cn(buttonVariants(), {
            "cursor-not-allowed opacity-60": isPending,
          })}
          disabled={isPending}
        >
          {isPending ? (
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
