import { unstable_getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"
import { prisma } from "../../../lib/db"

export default async function handler(req: any, res: any) {
  const session = await unstable_getServerSession(req, res, authOptions)
  if (session) {
    if (req.method === "GET") {
      await prisma.user
        .findUnique({
          where: {
            id: session.user.id
          },
          select: {
            defaultWorkspace: true
          }
        })
        .then((user: any) => {
          if (user.defaultWorkspace.length === 0) {
            return res.status(200).json({ id: "null" })
          }
          return res.status(200).json(...user.defaultWorkspace)
        })
        .catch((err: any) => {
          return res.status(500).json({
            err
          })
        })
    } else if (req.method === "POST") {
      if (req.body.isSame) {
        await prisma.user
          .update({
            where: {
              id: session.user.id
            },
            data: {
              defaultWorkspace: {
                disconnect: [{ id: req.body.id }]
              }
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
        // get a workspace id
        await prisma.user
          .update({
            where: {
              id: session.user.id
            },
            data: {
              defaultWorkspace: {
                set: [{ id: req.body.id }]
              }
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
      }
    } else {
      return res.redirect(307, "/404")
    }
  } else {
    return res.send({
      error: "You must be signed in to view the protected content on this page."
    })
  }
}
