import { unstable_getServerSession } from "next-auth"
import { prisma } from "../../../lib/db"
import { authOptions } from "../auth/[...nextauth]"

export default async function handler(req: any, res: any) {
  const session = await unstable_getServerSession(req, res, authOptions)
  if (session) {
    if (req.method === "GET") {
      let whereObj: any

      let where = req.query.where as string
      let cursor = parseInt(req.query.cursor)
      let pageSize = 10

      if (where !== undefined) {
        if (where === "") {
          return res.json({
            data: [],
            nextCursor: 0,
            previusCursor: 0
          })
        }
        whereObj = {
          OR: [
            { ticker: { startsWith: where.trim(), mode: "insensitive" } },
            where.length > 3
              ? { name: { contains: where.trim(), mode: "insensitive" } }
              : {}
          ]
        }
      }
      let data = await prisma.security.findMany({
        where: whereObj,
        select: {
          name: true,
          ticker: true,
          hasImg: true
        },
        skip: cursor > 1 ? cursor * pageSize : 0,
        take: pageSize
      })

      let nextCursor = data.length < 10 ? null : cursor + 1
      let previusCursor = cursor > 0 ? cursor - 1 : 0
      return res.json({
        data,
        nextCursor,
        previusCursor
      })
    }
  }
}
