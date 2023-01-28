import { unstable_getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"
import { prisma } from "../../../lib/db"

export default async function handler(req: any, res: any) {
  const session = await unstable_getServerSession(req, res, authOptions)
  const { id } = req.query
  if (session) {
    if (req.method === "PATCH") {
      if (req.body.data.addremove && req.body.data.addremove[0] !== undefined) {
        if (req.body.type === 0) {
          await prisma.watchlist
            .update({
              where: {
                id: req.body.id
              },
              data: {
                companies: {
                  connect: {
                    ticker: req.body.data.addremove[0].ticker
                  }
                }
              }
            })
            .then(async (updated: any) => {
              return res.send({
                ...updated
              })
            })
            .catch(async (e: any) => {
              return res.send({
                error: e
              })
            })
        } else {
          await prisma.watchlist
            .update({
              where: {
                id: req.body.id
              },
              data: {
                companies: {
                  disconnect: {
                    ticker: req.body.data.addremove[0].ticker
                  }
                }
              }
            })
            .then(async (updated: any) => {
              return res.send({
                ...updated
              })
            })
            .catch(async (e: any) => {
              return res.send({
                error: e
              })
            })
        }
      } else {
        await prisma.watchlist
          .update({
            where: {
              id: req.body.id
            },
            data: {
              ...req.body.data
            }
          })
          .then(async (updated: any) => {
            return res.send({
              ...updated
            })
          })
          .catch(async (e: any) => {
            return res.send({
              error: e
            })
          })
      }
    } else if (req.method === "DELETE") {
      const del = await prisma.watchlist.delete({
        where: {
          id: id
        }
      })
      return res.status(200).json({ data: del })
    } else {
      return res.redirect(307, "/404")
    }
  } else {
    return res.send({
      error: "You must be signed in to view the protected content on this page."
    })
  }
}
