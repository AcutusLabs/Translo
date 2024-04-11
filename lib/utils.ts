import { randomBytes } from "crypto"
import { ClassValue, clsx } from "clsx"
import sha256 from "crypto-js/sha256"
import { twMerge } from "tailwind-merge"

import { env } from "@/env.mjs"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(input: string | number): string {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function absoluteUrl(path: string) {
  return `${env.NEXT_PUBLIC_APP_URL}${path}`
}

export const hashPassword = (password: string) => {
  return sha256(password).toString()
}

export const generateEmailVerificationToken = () => {
  // generates a buffer containing 32 random bytes.
  // The 32 indicates the number of bytes to generate, and it is commonly used
  // for creating secure tokens or identifiers.
  return randomBytes(32).toString("hex")
}

export const isJson = (value: string) => {
  try {
    JSON.parse(value)
  } catch (e) {
    return false
  }
  return true
}

export const getBrowserLanguage = () => {
  let lang: string | undefined = "en"
  if (typeof window !== "undefined") {
    lang = window.navigator.languages
      ? window.navigator.languages[0]
      : undefined
    // @ts-ignore
    lang = lang || window.navigator.language
  }
  let shortLang = lang

  if (shortLang && shortLang.indexOf("-") !== -1) {
    ;[shortLang] = shortLang.split("-")
  }

  if (shortLang && shortLang.indexOf("_") !== -1) {
    ;[shortLang] = shortLang.split("_")
  }

  if (!shortLang) {
    shortLang = "en"
  }

  return shortLang
}
