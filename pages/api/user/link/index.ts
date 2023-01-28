import { unstable_getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]"
import { prisma } from "../../../../lib/db"

export default async function handler(req: any, res: any) {
  const session = await unstable_getServerSession(req, res, authOptions)
  if (
    session &&
    session.user.isAdmin &&
    req.method === "POST" &&
    req.body.uses !== undefined &&
    req.body.date !== undefined
  ) {
    await prisma.link
      .create({
        data: {
          uses: req.body.uses,
          expiresAt: new Date(req.body.date),
          creator: session.user.id
        }
      })
      .then((e: any) => {
        return res.send({
          data: e
        })
      })
  } else if (session && req.method === "GET") {
    await prisma.link
      .findMany({
        where: {
          creator: session?.user.id
        },
        include: {
          _count: {
            select: {
              usedBy: true
            }
          }
        },
        orderBy: [
          {
            createdAt: "desc"
          }
        ]
      })
      .then((e: any) => {
        return res.send({
          data: e
        })
      })
  } else if (session && session.user.isAdmin && req.method === "DELETE") {
    await prisma.link
      .findUnique({
        where: {
          key: req.body.id
        }
      })
      .then(async (e: { creator: string; key: any }) => {
        if (e?.creator === session.user.id) {
          await prisma.link
            .delete({
              where: {
                key: e.key
              }
            })
            .then((e: any) => {
              return res.send({
                data: e
              })
            })
        }
      })
  } else {
    return res.send({
      error: "You must be signed in to use this key"
    })
  }
}
