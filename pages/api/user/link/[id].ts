import { unstable_getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]"
import { prisma } from "../../../../lib/db"
import moment from "moment"

export default async function handler(req: any, res: any) {
  const session = await unstable_getServerSession(req, res, authOptions)
  const { id } = req.query
  if (session) {
    await prisma.link
      .findFirst({
        where: {
          key: id
        },
        include: {
          _count: {
            select: {
              usedBy: true
            }
          }
        }
      })
      .then(
        async (
          e:
            | {
                type: string
                uses: number
                _count: { usedBy: number }
                expiresAt: moment.MomentInput
                key: any
              }
            | null
            | undefined
        ) => {
          if (e === null || e === undefined) {
            return res.send({ error: "Token not valid." })
          } else {
            if (session.user.canAccess && e.type === "invite") {
              return res.send({
                error: "You already have access"
              })
            }
            if (
              (e.uses > e._count.usedBy || e.uses === 0) &&
              moment(e.expiresAt).isSameOrAfter(new Date())
            ) {
              // check if user can get reward

              await prisma.link
                .update({
                  where: {
                    key: e.key
                  },
                  data: {
                    usedBy: {
                      connect: [{ id: session.user.id }]
                    }
                  }
                })
                .then(async (e: { type: string }) => {
                  // user "used" link now we should add "reward"
                  if (e.type === "invite") {
                    await prisma.user
                      .update({
                        where: {
                          id: session.user.id
                        },
                        data: {
                          canAccess: true
                        }
                      })
                      .then((e: any) => {
                        return res.send({
                          data: "Successfully used link"
                        })
                      })
                  }
                })
            } else {
              return res.send({
                error: "Token expired or invalid."
              })
            }
          }
        }
      )
  } else {
    return res.send({
      error: "You must be signed in to use this key"
    })
  }
}
