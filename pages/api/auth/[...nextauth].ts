import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import DiscordProvider from "next-auth/providers/discord"
import RedditProvider from "next-auth/providers/reddit"
import EmailProvider from "next-auth/providers/email"

import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "../../../lib/db"
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.MAILJET_HOST,
        port: process.env.MAILJET_PORT,
        auth: {
          user: process.env.MAILJET_USER,
          pass: process.env.MAILJET_PASS
        }
      },
      from: process.env.MAILJET_FROM_ADDRESS
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string
    }),
    RedditProvider({
      clientId: process.env.REDDIT_CLIENT_ID as string,
      clientSecret: process.env.REDDIT_CLIENT_SECRET as string
    })
  ],
  theme: {
    colorScheme: "dark"
  },
  callbacks: {
    async signIn({ user }: any) {
      if (user) {
        return true
      } else {
        return false
      }
    },
    async session({ session, token, user }: any) {
      if (user) {
        session.user = user
      }
      return session
    }
  }
}

export default NextAuth(authOptions)
