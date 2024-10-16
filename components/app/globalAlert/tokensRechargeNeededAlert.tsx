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

const TokensRechargeNeeded = () => {
  const alertContext = useContext(AlertContext)
  const router = useRouter()

  return (
    <AlertDialog
      open={alertContext.alert === AlertType.tokensRechargeNeeded}
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
              "You don't have any more tokens to perform automatic translations"
            )}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {i18n.t("Please recharge your tokens")}
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

export default TokensRechargeNeeded
