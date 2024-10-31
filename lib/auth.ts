import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GitHubProvider from "next-auth/providers/github"

import { env } from "@/env.mjs"
import { db } from "@/lib/db"

import { hashPassword } from "./utils"

export const authOptions: NextAuthOptions = {
  // huh any! I know.
  // This is a temporary fix for prisma client.
  // @see https://github.com/prisma/prisma/issues/16117
  adapter: PrismaAdapter(db as any),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GitHubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing params")
        }

        const users = await db.user.findMany({
          where: {
            AND: [
              {
                email: {
                  contains: credentials.email,
                },
              },
              {
                password: {
                  contains: hashPassword(credentials.password),
                },
              },
            ],
          },
          select: {
            id: true,
            emailVerified: true,
          },
        })

        const user = users[0]

        if (!user) {
          throw new Error("Incorrect email or password")
        }

        if (!user?.emailVerified) {
          throw new Error("Email not verified")
        }

        return user
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.lang = token.lang
        session.user.image = token.picture
      }

      return session
    },
    async jwt({ token, user, trigger }) {
      const dbUser = await db.user.findFirst({
        where: {
          id: trigger === "signIn" ? token.sub : token.id,
        },
      })

      if (!dbUser) {
        if (user) {
          token.id = user?.id
          // @ts-ignore
          token.lang = user?.lang
        }
        return token
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        lang: dbUser.lang,
        picture: dbUser.image,
      }
    },
  },
}
