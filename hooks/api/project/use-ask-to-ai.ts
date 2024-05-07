import { useMutation } from "@tanstack/react-query"
import axios from "axios"

import { ApiResponseType } from "@/types/api"
import { handleApiError } from "@/lib/exceptions"
import i18n from "@/lib/i18n"
import { toast } from "@/components/ui/use-toast"

const askToAI = async (
  projectId: string,
  keywordId: string,
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
    url: `/api/chatGpt?projectId=${projectId}&keywordId=${keywordId}&sentence=${sentence}`,
    method: "GET",
  })
  return result.data
}

type AskToAI = ApiResponseType & {
  projectId: string
  keywordId: string
  sentence?: string
}

export const useAskToAI = ({
  projectId,
  keywordId,
  sentence,
  onSuccess,
  showAlertType,
}: AskToAI) => {
  return useMutation({
    mutationKey: ["useAskToAI", projectId, keywordId],
    mutationFn: async () => await askToAI(projectId, keywordId, sentence),
    onError: (error) => handleApiError(error, showAlertType),
    onSuccess,
  })
}
