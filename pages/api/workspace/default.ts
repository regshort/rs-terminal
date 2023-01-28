import { unstable_getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"
import { prisma } from "../../../lib/db"

export default async function handler(req: any, res: any) {
  const session = await unstable_getServerSession(req, res, authOptions)
  if (session) {
    if (req.method === "GET") {
      // here we should get all users workspaces and all public ones
      await prisma.workspace
        .findFirst({
          where: {
            globalDefault: true
          }
        })
        .then((e: any) => {
          return res.status(200).json(e)
        })
    }
  } else {
    return res.send({
      error: "You must be signed in to view the protected content on this page."
    })
  }
}
