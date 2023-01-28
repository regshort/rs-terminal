import { unstable_getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"
import { prisma } from "../../../lib/db"

export default async function handler(req: any, res: any) {
  const session = await unstable_getServerSession(req, res, authOptions)
  if (session) {
    if (req.method === "GET") {
      const users = await prisma.watchlist.findMany({
        where: {
          AND: [
            {
              ...(req.query.query !== undefined
                ? { name: { contains: req.query.query, mode: "insensitive" } }
                : {}),
              creator: {
                equals: session.user.id
              }
            }
          ]
        },
        include: {
          companies: {
            select: {
              ticker: true,
              name: true,
              hasImg: true
            }
          },
          user: {
            select: {
              name: true
            }
          }
        }
      })
      res.send([...users])
    } else if (req.method === "POST") {
      const data = JSON.parse(req.body)
      await prisma.watchlist
        .create({
          data: {
            name: data.name,
            companies: {
              connect: data.companies.map((c: any) => ({
                ticker: c
              }))
            },
            private: data.private,
            creator: session.user.id
          }
        })
        .then((watchlist: any) => {
          return res.status(200).json({
            success: true,
            data: watchlist
          })
        })
        .catch((err: any) => {
          return res.status(500).json({
            success: false,
            error: err
          })
        })
    }
  } else {
    return res.send({
      error: "You must be signed in to view the protected content on this page."
    })
  }
}
