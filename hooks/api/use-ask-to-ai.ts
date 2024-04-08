import { useMutation } from "@tanstack/react-query"
import axios from "axios"

import { ApiResponseType } from "@/types/api"
import { handleApiError } from "@/lib/exceptions"
import i18n from "@/lib/i18n"
import { toast } from "@/components/ui/use-toast"

const askToAI = async (
  projectId: string,
  keyword: string,
  sentence?: string
) => {
  if (!sentence) {
    return toast({
      title: i18n.t("Something went wrong"),
      variant: "destructive",
    })
    return
  }

  const result = await axios({
    url: `/api/chatGpt?projectId=${projectId}&keyword=${keyword}&sentence=${sentence}`,
    method: "GET",
  })
  return result.data
}

type AskToAI = ApiResponseType & {
  projectId: string
  keyword: string
  sentence?: string
}

export const useAskToAI = ({
  projectId,
  keyword,
  sentence,
  onSuccess,
  showAlertType,
}: AskToAI) => {
  return useMutation({
    mutationKey: ["addProject", projectId, keyword],
    mutationFn: async () => await askToAI(projectId, keyword, sentence),
    onError: (error) => handleApiError(error, showAlertType),
    onSuccess,
  })
}
