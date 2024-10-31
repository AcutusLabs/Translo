import { useContext } from "react"
import { useRouter } from "next/navigation"

import { AlertType } from "@/types/api"
import i18n from "@/lib/i18n"
import { navigate } from "@/lib/link"
import { AlertContext } from "@/app/[lang]/client-providers"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog"

const ProjectSubscriptionNeededAlert = () => {
  const alertContext = useContext(AlertContext)
  const router = useRouter()

  return (
    <AlertDialog
      open={alertContext.alert === AlertType.projectSubscriptionNeeded}
      onOpenChange={(open) => {
        if (!open) {
          alertContext.showAlert(undefined)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {i18n.t(
              "You have reached the maximum number of projects for a free account"
            )}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {i18n.t("Subscribe to create unlimited projects")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => alertContext.showAlert(undefined)}>
            {i18n.t("Cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              alertContext.showAlert(undefined)
              router.push(navigate().billing())
            }}
          >
            {i18n.t("Continue")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ProjectSubscriptionNeededAlert
