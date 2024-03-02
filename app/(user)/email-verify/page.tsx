"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { toast } from "@/components/ui/use-toast"
import { findUserByEmail, verifyEmail } from "@/app/api/users/utils"

export default function VerifyEmail() {
  const searchParams = useSearchParams()

  const email = searchParams?.get("email")
  const token = searchParams?.get("token")

  const [isLoading, setIsLoading] = useState(true)
  const [result, setResult] = useState("Error verifying your email")

  useEffect(() => {
    const emailVerification = async () => {
      try {
        if (!email || !token) {
          setIsLoading(false)
          return toast({
            title: "Something went wrong.",
            description: "Your email verification failed. Please try again.",
            variant: "destructive",
          })
        }

        const user = await findUserByEmail(email)
        if (!user) {
          setIsLoading(false)
          setResult("Invalid verification token.")
          throw new Error("Invalid verification token")
        }

        if (token !== user.emailVerificationToken) {
          setIsLoading(false)
          setResult("Invalid verification token.")
          throw new Error("Invalid verification token")
        }

        await verifyEmail(user.email)

        setResult("Email verified successfully. Please relogin.")
        window.location.replace("/")
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
        return toast({
          title: "Something went wrong.",
          description: "Your email verification failed. Please try again.",
          variant: "destructive",
        })
      }
    }

    emailVerification()
  }, [email, token])

  return (
    <>
      <div className="mb-4">{isLoading ? "Please wait ..." : result}</div>
      <div className="my-3">
        <Link href="/login" className="bg-white py-3 px-2 rounded">
          Back to Login
        </Link>
      </div>
    </>
  )
}
