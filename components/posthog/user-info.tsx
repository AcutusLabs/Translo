"use client"

import { useEffect } from "react"
import posthog from "posthog-js"

type UserInfoProps = {
  id: string
  subscription: string
  email: string
  language: string
  name: string
}

const UserInfo = (props: UserInfoProps) => {
  const { subscription, email, language, name, id } = props

  useEffect(() => {
    posthog.identify(id, {
      subscription,
      email,
      language,
      name,
    })
  }, [email, id, language, name, subscription])

  return <></>
}

export default UserInfo
