import { unstable_getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"
import { prisma } from "../../../lib/db"

export default async function handler(req: any, res: any) {
  const session = await unstable_getServerSession(req, res, authOptions)
  if (session) {
    if (req.method === "GET") {
      await prisma.recentfilter
        .findFirst({
          where: {
            creator: session.user.id
          },
          select: {
            securities: true
          }
        })
        .then((e: any) => {
          const data = e?.securities.map((e: any) => {
            return {
              ticker: e.ticker,
              name: e.name,
              hasImg: e.hasImg
            }
          })
          return res.json({
            data
          })
        })
    } else if (req.method === "POST") {
      let data = []
      let toDelete: any = []
      if (req.body.recentFilters.data) {
        data = [...req.body.recentFilters.data].reverse()
        toDelete = data
          .slice(4, req.body.recentFilters.data.length)
          .map((e: any) => {
            return { ticker: e.ticker }
          })
      }
      await prisma.recentfilter
        .upsert({
          where: {
            creator: session.user.id
          },
          update: {
            securities: {
              connect: { ticker: req.body.selectedItem.ticker },
              disconnect: toDelete
            }
          },
          create: {
            creator: session.user.id,
            securities: {
              connect: { ticker: req.body.selectedItem.ticker }
            }
          },
          select: {
            securities: true
          }
        })
        .then((e: any) => {
          return res.json({
            e
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
