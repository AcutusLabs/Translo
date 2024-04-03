import { Dispatch, SetStateAction } from "react"

export enum AlertType {
  projectSubscriptionNeeded = "projectSubscriptionNeeded",
  keywordsSubscriptionNeeded = "keywordsSubscriptionNeeded",
}

export type ShowAlertType = Dispatch<SetStateAction<AlertType | undefined>>

export type ApiResponseType = {
  onSuccess: (data: any) => void
  showAlertType?: ShowAlertType
}
