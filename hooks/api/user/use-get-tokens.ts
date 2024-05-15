import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const getTokens = async () => {
  const result = await axios({
    url: `/api/users/tokens`,
    method: "GET",
  })

  return result.data
}

type GetTokensApi = {
  initialData: number
}

export const getTokensQueryKey = () => ["getTokens"]

export const useGetTokens = ({ initialData }: GetTokensApi) => {
  return useQuery({
    queryKey: getTokensQueryKey(),
    queryFn: async () => await getTokens(),
    initialData,
  })
}
