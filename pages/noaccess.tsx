import { Button, ButtonGroup, Card, H1, H4, H5 } from "@blueprintjs/core"
import { NextPage } from "next"
import { signOut, useSession } from "next-auth/react"
import dynamic from "next/dynamic"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { Flex } from "../stitches.config"
const LoadingComp = dynamic(import("../components/loading"), { ssr: false })

const Noaccess: NextPage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  useEffect(() => {
    if (session?.user.canAccess) {
      router.push("/")
      return
    }
    if (!session) {
      router.push("/login")
    }
  }, [router, session])
  if (status === "loading") return <LoadingComp />
  if (status && !session?.user.canAccess) {
    return (
      <>
        <Head>
          <title>No Access - shortex.app</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <Flex className="justify-center items-center h-screen">
          <Card elevation={3}>
            <H4>No access</H4>
            <p>
              Shortex is invite only for now
              <br /> Message{" "}
              <Link href="https://twitter.com/shortexapp">@shortexapp</Link> on
              twitter to get an invite
            </p>
            <ButtonGroup className="justify-between w-full">
              <Button minimal icon="log-out" onClick={() => signOut()}>
                Logout
              </Button>
              <Link href={`${process.env.NEXT_PUBLIC_WEB_URL}`}>
                <Button minimal icon="home" text="Home" />
              </Link>
            </ButtonGroup>
          </Card>
        </Flex>
      </>
    )
  } else {
    return <LoadingComp />
  }
}
export default Noaccess
