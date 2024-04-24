"use client"

import { ChangeEvent, useCallback, useContext, useState } from "react"
import { useRouter } from "next/navigation"
import { DialogClose } from "@radix-ui/react-dialog"

import i18n from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { useAddProject } from "@/hooks/api/project/use-add-project"
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
import { AlertContext } from "@/app/client-providers"

const AddNewProject = () => {
  const [projectName, setProjectName] = useState<string>("")
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const alertContext = useContext(AlertContext)

  const { isPending, mutate } = useAddProject({
    projectName,
    onSuccess: (project) => {
      router.refresh()
      router.push(`/editor/${project.id}`)
      setProjectName("")
    },
    showAlertType: alertContext.showAlert,
  })

  const createProject = useCallback(() => {
    setOpen(false)
    mutate()
  }, [mutate])

  const handleProjectName = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setProjectName(e.target.value),
    []
  )

  const onOpenChange = useCallback((_open: boolean) => {
    setOpen(_open)
    if (_open) {
      setProjectName("")
    }
  }, [])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
        <form onSubmit={createProject}>
          <DialogHeader>
            <DialogTitle>
              <div className="capitalize">{i18n.t("New project")}</div>
            </DialogTitle>
          </DialogHeader>
          <div className="py-2 mt-5">
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
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddNewProject
