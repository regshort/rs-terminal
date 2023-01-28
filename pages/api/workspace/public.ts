import { unstable_getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"
import { prisma } from "../../../lib/db"

export default async function handler(req: any, res: any) {
  const session = await unstable_getServerSession(req, res, authOptions)

  if (req.method === "GET") {
    // here we should get all users workspaces and all public ones
    if (session) {
      const wss = await prisma.workspace.findMany({
        where: {
          OR: [{ globalDefault: true }, { private: false }],
          AND: [
            {
              ...(req.query.query !== undefined
                ? { name: { contains: req.query.query, mode: "insensitive" } }
                : {}),
              creator: {
                not: session.user.id
              }
            }
          ]
        },
        include: {
          user: {
            select: {
              name: true
            }
          }
        }
      })
      res.send([...wss])
    } else {
      res.send({
        error:
          "You must be signed in to view the protected content on this page."
      })
    }
  } else if (req.method === "POST") {
    const toPost = JSON.parse(req.body)
    if (session) {
      await prisma.workspace
        .create({
          data: {
            name: toPost.name,
            description: toPost.description,
            default: toPost.default,
            globalDefault: toPost.global_default,
            private: toPost.private,
            workspace: toPost.workspace,
            creator: session.user.id,
            watchlist: toPost.watchlist,
            relativeDate: toPost.relative_date
          }
        })
        .then((e: any) => {
          return res.status(200).json({ data: e })
        })
        .catch((err: any) => {
          return res.status(400).send({ error: err })
        })
    } else {
      return res.send({
        error:
          "You must be signed in to view the protected content on this page."
      })
    }
  }
}
