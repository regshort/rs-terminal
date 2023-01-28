import { unstable_getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"
import { prisma } from "../../../lib/db"

export default async function handler(req: any, res: any) {
  const session = await unstable_getServerSession(req, res, authOptions)
  if (session) {
    if (req.method === "GET") {
      await prisma.user
        .delete({
          where: {
            id: session.user.id
          }
        })
        .then((user: any) => {
          return res.status(200).json(user)
        })
        .catch((err: any) => {
          return res.status(500).json({
            err
          })
        })
    } else {
      return res.redirect(307, "/404")
    }
  } else {
    return res.send({
      error: "You must be signed in to view the protected content on this page."
    })
  }
}
