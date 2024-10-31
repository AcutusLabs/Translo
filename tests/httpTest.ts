import { Page } from "@playwright/test"

import { baseURL } from "../playwright.config"
import { sleep } from "./utils"

const axios = require("axios")

export const httpCall = async (params: {
  page?: Page
  cookies?: any[]
  method: "DELETE" | "POST" | "GET" | "PUT"
  url: string
  data?: string
}) => {
  const { page, cookies, method, url, data } = params

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Cookie: cookies,
  }

  let response
  try {
    switch (method) {
      case "GET":
        response = await axios.get(`${baseURL}/api${url}`, {
          headers,
          data,
        })
        break
      case "PUT":
        response = await axios.put(`${baseURL}/api${url}`, data, {
          headers,
        })
        break
      case "POST":
        response = await axios.post(`${baseURL}/api${url}`, data, {
          headers,
        })
        break
      case "DELETE":
        response = await axios.delete(`${baseURL}/api${url}`, {
          headers,
          data,
        })
        break
      default:
        throw "method not found: " + method + url
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
  }

  if (page) {
    await Promise.race([page.waitForLoadState("networkidle"), sleep(5000)])
  }
  await sleep(500)
  return response.data
}
