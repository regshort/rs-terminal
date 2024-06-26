import { unstable_getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]"
import { prisma } from "../../../../lib/db"

export default async function handler(req: any, res: any) {
  const session = await unstable_getServerSession(req, res, authOptions)
  if (session) {
    if (req.method === "GET") {
      const data = await prisma.user.findFirst({
        where: {
          id: session.user.id
        },
        select: {
          likedWatchlists: {
            select: {
              id: true,
              name: true,
              globalDefault: true,
              private: true,
              user: true
            }
          }
        }
      })
      res.json({
        data: data?.likedWatchlists
      })
      //   return res.redirect(307, "/404")
    } else if (req.method === "PATCH") {
      if (req.body.isLinked) {
        await prisma.user
          .update({
            where: {
              id: session.user.id
            },
            data: {
              likedWatchlists: {
                disconnect: [{ id: req.body.id }]
              }
            }
          })
          .then((updated: any) => {
            res.status(200).json({
              success: true,
              data: updated
            })
          })
          .catch((err: any) => {
            res.status(500).json({
              success: false,
              error: err
            })
          })
      } else {
        await prisma.user
          .update({
            where: {
              id: session.user.id
            },
            data: {
              likedWatchlists: {
                connect: [{ id: req.body.id }]
              }
            }
          })
          .then((updated: any) => {
            res.status(200).json({
              success: true,
              data: updated
            })
          })
          .catch((err: any) => {
            res.status(500).json({
              success: false,
              error: err
            })
          })
      }
    } else {
      return res.redirect(307, "/404")
    }
  } else {
    res.send({
      error: "You must be signed in to view the protected content on this page."
    })
  }
}
