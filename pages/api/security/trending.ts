import { unstable_getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"
import { prisma } from "../../../lib/db"

export default async function handler(req: any, res: any) {
  const session = await unstable_getServerSession(req, res, authOptions)
  if (session) {
    if (req.method === "GET") {
      await prisma.security
        .findMany({
          where: {
            recentFilter: {
              some: {}
            }
          },
          orderBy: [
            {
              recentFilter: {
                _count: "desc"
              }
            }
          ],
          select: {
            name: true,
            hasImg: true,
            ticker: true,
            _count: true
          },
          take: 10
        })
        .then((data: any) => {
          return res.json({
            data
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
