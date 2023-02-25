import { unstable_getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"
import { prisma } from "../../../lib/db"

export default async function handler(req: any, res: any) {
  const session = await unstable_getServerSession(req, res, authOptions)
  if (session) {
    if (req.method === "GET") {
      // we want to get all of users data and dump it
      // we have a user with account
      const user = await prisma.user.findFirst({
        where: {
          id: session.user.id
        },
        include: {
          accounts: true,
          sessions: true,
          workspaces: true,
          watchlists: true
        }
      })

      return res.status(200).json({ user })
    } else {
      return res.redirect(307, "/404")
    }
  } else {
    res.send({
      error: "You must be signed in to view the protected content on this page."
    })
  }
}
