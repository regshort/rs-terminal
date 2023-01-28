import { unstable_getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"
import path from "path"
import * as fs from "fs"
import jwt from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid"

import { setCookie } from "cookies-next"

const privateKey = fs.readFileSync(path.join(process.cwd(), "private.ec.key"), {
  encoding: "utf8",
})
const publicKey = fs.readFileSync(path.join(process.cwd(), "public.pem"), {
  encoding: "utf8",
})

export const decode = async ({ token }: any) => {
  return jwt.verify(token, publicKey, { algorithms: ["ES512"] }) as any
}

export const encode = async ({ token }: any) => {
  return jwt.sign(
    {
      state: token?.state,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
      nbf: Math.floor(Date.now() / 1000),
      jti: uuidv4(),
      user: token?.user,
    },
    privateKey,
    { algorithm: "ES512" }
  )
}
export default async function handler(req: any, res: any) {
  const session = await unstable_getServerSession(req, res, authOptions)
  if (session) {
    const jwt = await encode(session)
    setCookie("next-auth.jwt", jwt, { req, res, maxAge: 60 * 60 * 24, domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN})
    return res.status(200).send()
  } else {
    return res.send({
      error:
        "You must be signed in to view the protected content on this page.",
    })
  }
}
