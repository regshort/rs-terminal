import { NextPage } from "next"
import dynamic from "next/dynamic"

import { useRouter } from "next/router"
import { useEffect } from "react"
import React from "react"
const LoadingComp = dynamic(import("../../components/loading"), { ssr: false })

const Verifyrequest: NextPage = () => {
  const router = useRouter()
  // just redirect to login with a query
  useEffect(() => {
    router.push({
      pathname: "/",
      query: { email: "send" }
    })
  }, [router])
  return <LoadingComp />
}
export default Verifyrequest
