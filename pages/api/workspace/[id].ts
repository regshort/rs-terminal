import { unstable_getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"
import { prisma } from "../../../lib/db"
export default async function handler(req: any, res: any) {
  const session = await unstable_getServerSession(req, res, authOptions)
  const { id } = req.query
  if (session) {
    if (req.method === "GET") {
      await prisma.workspace
        .findFirst({
          where: {
            OR: [{ private: false }, { creator: session.user.id }],
            id: id
          }
        })
        .then((e: any) => {
          res.send({
            content: e
          })
        })
      // const posts = await prisma.user.findFirst({
      //   where: {
      //     id: session.user.id,
      //   },
      //   include: {
      //     workspaces: true,
      //   },
      // })
      // // no workspaces found
      // if (posts === undefined) {
      //   return res.status(400).json({ data: undefined })
      // }
      // const d = posts?.workspaces.map((post: any) => {
      //   return {
      //     id: post.id,
      //     name: post.name,
      //     default: post.default,
      //     globalDefault: post.globalDefault,
      //     private: post.private,
      //     workspace: post.workspace,
      //   }
      // })
      // res.send({
      //   content: d,
      // })
    } else if (req.method === "PATCH") {
      const { id } = req.query
      await prisma.workspace
        .update({
          where: {
            id: id
          },
          data: {
            ...req.body.data
          }
        })
        .then(async (updated: any) => {
          res.send({
            ...updated
          })
        })
        .catch(async (e: any) => {
          console.log(e)

          res.status(400).send({
            error: e
          })
        })
    } else if (req.method === "DELETE") {
      await prisma.workspace
        .delete({
          where: {
            id: id
          }
        })
        .then(async (updated: any) => {
          res.send({
            ...updated
          })
        })
        .catch(async (e: any) => {
          res.send({
            error: e
          })
        })
    } else {
      res.send({
        error:
          "You must be signed in to view the protected content on this page."
      })
    }
  }
}
