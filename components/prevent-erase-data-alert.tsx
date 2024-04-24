import { useContext } from "react"

import i18n from "@/lib/i18n"
import { AlertContext } from "@/app/client-providers"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog"

type Props = {
  visible: boolean
  onCloseFromModal: (exit: boolean) => void
}

const PreventEraseData = (props: Props) => {
  const { visible, onCloseFromModal } = props
  const alertContext = useContext(AlertContext)

  return (
    <AlertDialog
      open={visible}
      onOpenChange={(open) => {
        if (!open) {
          alertContext.showAlert(undefined)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{i18n.t("Unsaved Changes Alert")}</AlertDialogTitle>
          <AlertDialogDescription>
            {i18n.t(
              "Are you sure you want to exit without saving your changes?"
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onCloseFromModal(false)}>
            {i18n.t("Cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onCloseFromModal(true)
            }}
          >
            {i18n.t("Exit without saving")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default PreventEraseData
